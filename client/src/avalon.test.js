import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const backend = vi.hoisted(() => {
  const snapshots = new Map();
  const reference = path => ({
    collection: name => ({ doc: id => reference(`${path}/${name}/${id}`) }),
    onSnapshot: callback => {
      snapshots.set(path, callback);
      return () => snapshots.delete(path);
    },
    get: async () => ({ data: () => ({ games: 10, good_wins: 5 }) }),
  });
  const state = { authCallback: null };
  const authUnsubscribe = vi.fn();
  return {
    snapshots, state, authUnsubscribe,
    firebase: {
      initializeApp: vi.fn(),
      firestore: () => ({ collection: name => ({ doc: id => reference(`${name}/${id}`) }) }),
      auth: () => ({
        onAuthStateChanged: callback => {
          state.authCallback = callback;
          return authUnsubscribe;
        },
      }),
    },
  };
});

vi.mock('firebase/compat/app', () => ({ default: backend.firebase }));
vi.mock('firebase/compat/auth', () => ({}));
vi.mock('firebase/compat/firestore', () => ({}));
vi.mock('./firebase-config', () => ({ default: {} }));
vi.mock('./avalon-api-rest', () => ({
  AvalonApi: class {
    login = vi.fn(async () => {});
  },
}));

let AvalonGame;
beforeAll(async () => {
  vi.stubGlobal('window', {
    location: { origin: 'https://example.com', search: '', pathname: '/', href: 'https://example.com/' },
    history: { replaceState: vi.fn() },
  });
  AvalonGame = (await import('./avalon.js')).default;
});
beforeEach(() => {
  backend.snapshots.clear();
  vi.clearAllMocks();
});
afterAll(() => vi.unstubAllGlobals());

async function signIn(avalon) {
  avalon.init();
  backend.state.authCallback({ uid: 'alice', email: 'alice@example.com' });
  await Promise.resolve();
  backend.snapshots.get('users/alice')({
    exists: true,
    data: () => ({ uid: 'alice', name: 'ALICE', lobby: 'EXAMPLE' }),
  });
}

function lobbyDocument(votes = []) {
  return {
    exists: true,
    data: () => ({
      name: 'EXAMPLE', admin: { uid: 'alice', name: 'ALICE' },
      users: { alice: { name: 'ALICE' }, bob: { name: 'BOB' } },
      game: {
        state: 'ACTIVE', phase: 'PROPOSAL_VOTE', roles: ['MERLIN', 'MORGANA'],
        players: ['ALICE', 'BOB'],
        missions: [{ state: 'PENDING', proposals: [{ state: 'PENDING', proposer: 'ALICE', team: ['BOB'], votes }] }],
      },
    }),
  };
}

describe('React application subscriptions', () => {
  it('publishes initialization and supports unsubscribing without removing legacy events', () => {
    const legacy = vi.fn();
    const avalon = new AvalonGame(legacy);
    const versions = [];
    const events = [];
    const stopState = avalon.subscribe(() => versions.push(avalon.getSnapshot()));
    const stopEvents = avalon.onEvent((...args) => events.push(args));
    avalon.init();
    backend.state.authCallback(null);
    avalon.notifyEvent('PLAYER_JOINED', 'BOB');
    stopState();
    stopEvents();
    avalon.notifyEvent('PLAYER_LEFT', 'BOB');
    expect({ initialized: avalon.initialized, versions, events, legacy: legacy.mock.calls }).toStrictEqual({
      initialized: true, versions: [1, 2], events: [['PLAYER_JOINED', 'BOB']],
      legacy: [['PLAYER_JOINED', 'BOB'], ['PLAYER_LEFT', 'BOB']],
    });
    avalon.dispose();
  });

  it('publishes auth, user, role and same-phase vote updates without requiring a game event', async () => {
    const avalon = new AvalonGame();
    await signIn(avalon);
    expect(avalon.initialized).toBe(false);
    backend.snapshots.get('lobbies/EXAMPLE')(lobbyDocument());
    expect(Boolean(avalon.isGameInProgress)).toBe(false);
    const beforeRole = avalon.getSnapshot();
    backend.snapshots.get('lobbies/EXAMPLE/roles/alice')({ data: () => ({ role: 'MERLIN' }) });
    expect({ version: avalon.getSnapshot(), inGame: Boolean(avalon.isGameInProgress) }).toStrictEqual({
      version: beforeRole + 1, inGame: true,
    });
    const beforeVote = avalon.getSnapshot();
    backend.snapshots.get('lobbies/EXAMPLE')(lobbyDocument(['BOB']));
    expect({ version: avalon.getSnapshot(), votes: avalon.game.currentProposal.votes }).toStrictEqual({
      version: beforeVote + 1, votes: ['BOB'],
    });
    avalon.dispose();
  });

  it('releases Firebase listeners and resets routing when unmounted', async () => {
    const avalon = new AvalonGame();
    await signIn(avalon);
    backend.snapshots.get('lobbies/EXAMPLE')(lobbyDocument());
    avalon.dispose();
    expect({
      authCalls: backend.authUnsubscribe.mock.calls,
      snapshots: backend.snapshots,
      initialized: avalon.initialized, user: avalon.user, lobby: avalon.lobby,
    }).toStrictEqual({ authCalls: [[]], snapshots: new Map(), initialized: false, user: null, lobby: null });
  });

  it('prevents a pending login from subscribing after disposal', async () => {
    const avalon = new AvalonGame();
    let completeLogin;
    avalon.api.login = () => new Promise(resolve => { completeLogin = resolve; });
    avalon.init();
    backend.state.authCallback({ uid: 'alice', email: 'alice@example.com' });
    avalon.dispose();
    completeLogin();
    await Promise.resolve();
    expect({ snapshots: backend.snapshots, stats: avalon.globalStats }).toStrictEqual({
      snapshots: new Map(), stats: null,
    });
  });

  it('disconnects lobby and user listeners when authentication ends', async () => {
    const avalon = new AvalonGame();
    await signIn(avalon);
    backend.state.authCallback(null);
    expect({ snapshots: backend.snapshots, loggedIn: avalon.isLoggedIn, lobby: avalon.lobby }).toStrictEqual({
      snapshots: new Map(), loggedIn: false, lobby: null,
    });
    avalon.dispose();
  });
});
