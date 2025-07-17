import { defineComponent, ref, watch, computed, PropType } from 'vue';

interface AvalonUser {
  name: string;
}

interface Mission {
  teamSize: number;
}

interface Proposal {
  team: string[];
  votes: string[];
}

interface LobbyRole {
  assassin: boolean;
}

interface Game {
  players: string[];
  phase: string;
  currentProposer: string;
  currentProposalIdx: number;
  currentMission: Mission;
  currentProposal: Proposal;
  lastProposal: Proposal | null;
  hammer: string;
}

interface Lobby {
  role: LobbyRole;
}

interface AvalonData {
  game: Game;
  user: AvalonUser;
  lobby: Lobby;
}

function joinWithAnd(array: string[]): string {
  if (array.length === 0) return '';
  if (array.length === 1) return array[0];
  const arrCopy = array.slice(0);
  const lastElement = arrCopy.pop();
  return arrCopy.join(', ') + ' and ' + lastElement;
}

export default defineComponent({
  name: 'GamePlayerList',
  props: {
    avalon: {
      type: Object as PropType<AvalonData>,
      required: true
    }
  },
  emits: ['selected-players'],
  setup(props, { emit }) {
    const selectedPlayers = ref<string[]>([]);
    const allowSelect = ref(true);

    const crownColor = computed(() => {
      return (props.avalon.game.currentProposalIdx < 4) ? '#fcfc00' : '#cc0808';
    });

    const enableCheckboxes = (name: string): boolean => {
      return (props.avalon.game.phase === 'TEAM_PROPOSAL' && props.avalon.game.currentProposer === props.avalon.user.name) ||
             (props.avalon.game.phase === 'ASSASSINATION' && props.avalon.lobby.role.assassin && (name !== props.avalon.user.name));
    };

    const selectedForMission = (name: string): boolean => {
      return (props.avalon.game.phase === 'PROPOSAL_VOTE' || props.avalon.game.phase === 'MISSION_VOTE') &&
        props.avalon.game.currentProposal.team.includes(name);
    };

    const hasVoted = (name: string): boolean => {
      return (props.avalon.game.phase === "PROPOSAL_VOTE") &&
             (props.avalon.game.currentProposal.votes.includes(name));
    };

    const waitingOnVote = (name: string): boolean => {
      return (props.avalon.game.phase === "PROPOSAL_VOTE") &&
             (!props.avalon.game.currentProposal.votes.includes(name));
    };

    const wasOnLastTeamProposed = (name: string): boolean => {
      switch (props.avalon.game.phase) {
        case "TEAM_PROPOSAL":
        case "ASSASSINATION":
          return props.avalon.game.lastProposal && props.avalon.game.lastProposal.team.includes(name);
        case "PROPOSAL_VOTE":
        case "MISSION_VOTE":
          return props.avalon.game.currentProposal.team.includes(name);
        default:
          console.error("Unhandled game phase", props.avalon.game.phase);
          return false;
      }
    };

    const approvedProposal = (name: string): boolean => {
      if (props.avalon.game.phase === "TEAM_PROPOSAL" || props.avalon.game.phase === 'ASSASSINATION') {
        return props.avalon.game.lastProposal && props.avalon.game.lastProposal.votes.includes(name);
      } else if (props.avalon.game.phase === "MISSION_VOTE") {
        return props.avalon.game.currentProposal.votes.includes(name);
      }
      return false;
    };

    const rejectedProposal = (name: string): boolean => {
      if (props.avalon.game.phase === "TEAM_PROPOSAL" || props.avalon.game.phase === 'ASSASSINATION') {
        return props.avalon.game.lastProposal && !props.avalon.game.lastProposal.votes.includes(name);
      } else if (props.avalon.game.phase === "MISSION_VOTE") {
        return !props.avalon.game.currentProposal.votes.includes(name);
      }
      return false;
    };

    const tooltipText = (name: string): string | null => {
      const states: string[] = [];
      if (wasOnLastTeamProposed(name)) {
        states.push('was on the last proposed team');
      }

      if (waitingOnVote(name)) {
        states.push('is currently voting on the proposal');
      } else if (hasVoted(name)) {
        states.push('has submitted a vote for the proposed team');
      } else if (approvedProposal(name)) {
        states.push('approved the last team');
      } else if (rejectedProposal(name)) {
        states.push('rejected the last team');
      }

      if (states.length === 0) return null;

      return name + ' ' + joinWithAnd(states);
    };

    watch(selectedPlayers, (newSelectedPlayers) => {
      let maxSelected = 1;      
      if (props.avalon.game.phase === 'TEAM_PROPOSAL') {
        maxSelected = props.avalon.game.currentMission.teamSize;
      }

      if (newSelectedPlayers.length > maxSelected) {
        selectedPlayers.value.shift();
      }
      emit('selected-players', selectedPlayers.value);
    }, { deep: true });

    watch(() => props.avalon.game.phase, () => {
      selectedPlayers.value.splice(0);
    });

    return {
      selectedPlayers,
      allowSelect,
      crownColor,
      enableCheckboxes,
      selectedForMission,
      hasVoted,
      waitingOnVote,
      wasOnLastTeamProposed,
      approvedProposal,
      rejectedProposal,
      tooltipText
    };
  }
});