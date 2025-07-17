import _ from 'lodash';

interface Role {
  name: string;
  role: string;
}

interface RoleInfo {
  team: 'good' | 'evil';
}

interface Proposal {
  proposer: string;
  team: string[];
  state: string;
  votes: string[];
}

interface Mission {
  state: 'PENDING' | 'SUCCESS' | 'FAIL';
  team: string[];
  proposals: Proposal[];
  evilOnTeam?: string[];
  failsRequired: number;
  numFails: number;
}

interface GameOutcome {
  state: string;
  roles: Role[];
  assassinated?: string;
}

interface Game {
  players: string[];
  missions: Mission[];
  outcome: GameOutcome;
}

interface Badge {
  title: string;
  body: string;
}

// Utility function to replicate Array.prototype.joinWithAnd
function joinWithAnd(array: string[]): string {
  if (array.length === 0) return '';
  if (array.length === 1) return array[0];
  const arrCopy = array.slice(0);
  const lastElement = arrCopy.pop();
  return arrCopy.join(', ') + ' and ' + lastElement;
}

export default class GameAnalysis {
  private game: Game;
  private rolesByName: Record<string, Role>;
  private namesByRole: Record<string, string>;
  private evilPlayers: string[];
  private goodPlayers: string[];
  private missions: Mission[];

  constructor(game: Game, roleMap: Record<string, RoleInfo>) {
    this.game = game;
    this.rolesByName = _.keyBy(game.outcome.roles, 'name');
    this.namesByRole = _.invert(_.mapValues(this.rolesByName, r => r.role)); // this is lossy for non-unique roles!
    this.evilPlayers = game.outcome.roles.filter(r => roleMap[r.role].team === 'evil').map(r => r.name);
    this.goodPlayers = game.outcome.roles.filter(r => roleMap[r.role].team === 'good').map(r => r.name);
    this.missions = game.missions.map(m => {
      const mission = { ...m };
      mission.evilOnTeam = m.team.filter(n => this.evilPlayers.includes(n));
      return mission;
    });
  }

  private roleProposesRole(proposerRole: string, roleProposed: string): boolean {
    if (!this.namesByRole[proposerRole] || !this.namesByRole[roleProposed]) return false;

    for (const mission of this.missions) {
      for (const proposal of mission.proposals) {
        if ((proposal.proposer === this.namesByRole[proposerRole]) &&
            proposal.team.includes(this.namesByRole[roleProposed])) {
          return true;
        }
      }
    }
    return false;
  }

  private roleApprovesRole(approverRole: string, roleProposed: string): boolean {
    if (!this.namesByRole[approverRole] || !this.namesByRole[roleProposed]) return false;

    for (const mission of this.missions) {
      for (const [proposalIdx, proposal] of mission.proposals.entries()) {
        if ((proposalIdx !== 4) && // hammer approvals don't count
            proposal.team.includes(this.namesByRole[roleProposed]) &&
            proposal.votes.includes(this.namesByRole[approverRole])) {
          return true;
        }
      }
    }
    return false;
  }

  private roleTrustsRole(sourceRole: string, destRole: string, badgeGenerator: (msg: string) => Badge): Badge | false {
    const proposed = this.roleProposesRole(sourceRole, destRole);
    const approved = this.roleApprovesRole(sourceRole, destRole);
    if (proposed || approved) {
      let msg = '';
      if (proposed && approved) {
        msg = 'both proposed and approved teams';
      } else if (proposed) {
        msg = 'proposed a team';
      } else {
        msg = 'approved a team';
      }
      return badgeGenerator(msg);
    }
    return false;
  }

  private badges = {
    merlinSendsEvilTeam: (): Badge | false => {
      if (!this.namesByRole['MERLIN']) return false;

      for (const mission of this.missions) {
        const approvedProposal = mission.proposals.find(p => p.state === 'APPROVED');
        if (approvedProposal &&
            (this.namesByRole['MERLIN'] === approvedProposal.proposer) &&
            (mission.evilOnTeam!.length >= mission.failsRequired)) {
          return {
            title: 'Traitor Merlin',
            body: `Merlin sent an evil team with ${joinWithAnd(mission.evilOnTeam!)}`
          };
        }
      }
      return false;
    },
    merlinProposesEvilTeam: (): Badge | false => {
      if (!this.namesByRole['MERLIN']) return false;

      for (const mission of this.missions) {
        for (const proposal of mission.proposals) {
          if ((proposal.proposer === this.namesByRole['MERLIN']) &&
               proposal.votes.includes(this.namesByRole['MERLIN']) &&
               proposal.team.filter(p => this.evilPlayers.includes(p) && this.rolesByName[p].role !== 'MORDRED').length > mission.failsRequired) {
            return {
              title: 'Advanced Merlin',
              body: `Merlin proposed and approved a team with ${joinWithAnd(mission.evilOnTeam!)}`
            };
          }
        }
      }
      return false;
    },
    runningScared: (): Badge | false => {
      for (const [missionIdx, mission] of this.missions.entries()) {
        if ((mission.evilOnTeam!.length > 1) && (mission.numFails === 0)) {
          return {
            title: 'No, you do it',
            body: `${joinWithAnd(mission.evilOnTeam!)} went on mission ${missionIdx + 1} together and nobody failed`
          };
        }
      }
      return false;
    },
    failureToCoordinate: (): Badge | false => {
      for (const [missionIdx, mission] of this.missions.entries()) {
        if ((mission.numFails > mission.failsRequired) &&
            (missionIdx < this.missions.length - 1) &&
            (this.missions[missionIdx + 1].state !== 'PENDING')) { // on last mission, it doesn't matter
          return {
            title: 'Failure to coordinate',
            body: `${joinWithAnd(mission.evilOnTeam!)} had ${mission.numFails} failure votes on mission ${missionIdx+1}`
          };
        }
      }
      return false;
    },
    perfectCoordination: (): Badge | false => {
      for (const [missionIdx, mission] of this.missions.entries()) {
        if ((mission.evilOnTeam!.length > mission.numFails) && (mission.numFails === mission.failsRequired)) {
          return {
            title: 'Same wavelength',
            body: `${joinWithAnd(mission.evilOnTeam!)} had perfect coordination on mission ${missionIdx + 1}`
          };
        }
      }
      return false;
    },
    forcesOfEvil: (): Badge | false => {
      if (this.evilPlayers.length <= 2) return false;

      for (const [missionIdx, mission] of this.missions.entries()) {
        if (mission.evilOnTeam!.length === this.evilPlayers.length) {
          return {
            title: 'With our powers combined',
            body: `All evil players went on mission ${missionIdx + 1} together`
          };
        }
      }
      return false;
    },
    noEvilPlayersOnMissions: (): Badge | false => {
      if (_.tail(this.missions).every(m => m.evilOnTeam!.length === 0)) {
        return {
          title: 'Lockdown',
          body: 'No evil players went on any missions' +
            (this.missions[0].evilOnTeam!.length ? ' after mission 1' : '')
        };
      }
      return false;
    },
    cleanSweep: (): Badge | false => {
      if ((this.missions[0].state === this.missions[1].state) &&
          (this.missions[1].state === this.missions[2].state)) {
        if (this.missions[0].state === 'FAIL') {
          return {
            title: 'Nasty, brutish, and short',
            body: 'Evil team dominated the game'
          };
        } else {
          if (this.game.outcome.state === 'EVIL_WIN') {
            return {
              title: "Look, ma, no hands",
              body: 'Evil team won despite not failing any missions'
            };
          } else {
            return {
              title: 'Clean sweep',
              body: 'Good team dominated the game'
            };
          }
        }
      }
      return false;
    },
    trustYou: (): Badge | false => {
      for (const mission of this.missions) {
        for (const proposal of mission.proposals) {
          if (proposal.team.length && !proposal.team.includes(proposal.proposer)) {
            return {
              title: 'I trust you guys',
              body: `${proposal.proposer} proposed a team that did not include themselves`
            };
          }
        }
      }
      return false;
    },
    trustingBunch: (): Badge | false => {
      const approvedIdx = this.missions[0].proposals.findIndex(p => p.state === 'APPROVED');
      if ((approvedIdx >= 0) && (approvedIdx < 4)) {
        return {
          title: 'What a trusting bunch',
          body: `First mission got approved within ${approvedIdx + 1} ${approvedIdx === 0 ? 'try' : 'tries'}`
        };
      }
      return false;
    },
    playingTheLongCon: (): Badge | false => {
      for(const [missionIdx, mission] of _.tail(this.missions).entries()) {
        if ((mission.evilOnTeam!.length === 1) &&
            (mission.failsRequired < 2) &&
            (mission.numFails === 0)) {
          return {
            title: 'Playing the long con',
            body: `${mission.evilOnTeam![0]} stayed undercover instead of failing mission ${missionIdx + 2}`
          };
        }
      }
      return false;
    },
    universalAcclaim: (): Badge | false => {
      for(const [missionIdx, mission] of this.missions.entries()) {
        for(const proposal of _.initial(mission.proposals)) {
          if (proposal.votes.length === this.game.players.length) {
            return {
              title: 'Universal acclaim',
              body: `Everyone voted for ${proposal.proposer}'s proposal on mission ${missionIdx + 1}`
            };
          }
        }
      }
      return false;
    },
    stillWaiting: (): Badge | false => {
      // evil player only went on good missions
      let evilPlayersOnGoodMissions: string[] = [];
      let evilPlayersOnBadMissions: string[] = [];
      for(const mission of this.missions) {
        if (mission.state === 'SUCCESS') {
          evilPlayersOnGoodMissions = evilPlayersOnGoodMissions.concat(mission.evilOnTeam!);
        } else if (mission.state === 'FAIL') {
          evilPlayersOnBadMissions = evilPlayersOnBadMissions.concat(mission.evilOnTeam!);
        }
      }
      const candidates = _.difference(evilPlayersOnGoodMissions, evilPlayersOnBadMissions);
      if (candidates.length) {
        return {
          title: 'Biding my time',
          body: `${candidates[0]} was evil, but only went on successful missions`
        };
      }
      return false;
    },
    assassinationAnalysis: (): Badge | false => {
      if (this.game.outcome.assassinated) {
        if (this.evilPlayers.includes(this.game.outcome.assassinated)) {
          return {
            title: 'Stabbed in the back',
            body: 'Evil player got assassinated'
          };
        }
        if (this.rolesByName[this.game.outcome.assassinated].role === 'PERCIVAL') {
          return {
            title: 'Taking a bullet for you',
            body: 'Percival got assassinated'
          };
        }
      }
      return false;
    },
    reversalOfFortune: (): Badge | false => {
      //pulled it out in the end: one side wins first 2, other side wins the game
      if ((this.missions[0].state === this.missions[1].state) &&
          (this.missions[1].state !== this.missions[2].state) &&
          (this.missions[2].state === this.missions[3].state) &&
          (this.missions[3].state === this.missions[4].state)) {        
        if ((this.missions[0].state === 'FAIL') &&
            (this.game.outcome.state === 'GOOD_WIN')) {
          return {
            title: 'Reversal of fortune',
            body: 'Good won the game despite losing first two missions'
          };
        } else if (this.missions[0].state === 'SUCCESS') {
          return {
            title: 'Stunning comeback',
            body: 'Evil won the game despite losing first two missions'
          };
        }
      }
      return false;
    },
    sameTeam: (): Badge | false => {
      let lastTeam: string[] = [];
      let teamProposalCount = 0;
      outer: for (const mission of this.missions) {
        for(const proposal of mission.proposals) {
          if (_.isEqual(_.sortBy(lastTeam), _.sortBy(proposal.team))) {
            teamProposalCount = teamProposalCount + 1;
          } else {
            if (teamProposalCount >= 3) break outer;
            lastTeam = proposal.team;
            teamProposalCount = 1;
          }
        }
      }
      if (teamProposalCount >= 3) {
        return {
          title: 'We made up our minds',
          body: `The team of ${joinWithAnd(lastTeam)} got proposed ${teamProposalCount} times in a row`
        };
      }
      return false;
    },
    playerDoesntGoOnMissions: (): Badge | false => {
      let players = this.game.players.slice(0);
      const completedMissions = this.missions.filter(m => m.state !== 'PENDING');
      if (completedMissions.length === 0) return false;
      for(const mission of _.initial(completedMissions)) {
        players = _.difference(players, mission.team);
        if (players.length === 0) break;
      }
      if (players.length > 0) {
        const player = players[0];
        if (completedMissions[completedMissions.length - 1].team.includes(player)) {
          return {
            title: 'Here to save the day',
            body: `${player} did not go on any mission except the last one`
          };
        } else {
          return {
            title: 'Put me in, coach!',
            body: `${player} did not go on a single mission`
          };
        }
      }
      return false;
    },
    almostLost: (): Badge | false => {
      if (this.game.outcome.state !== 'GOOD_WIN') return false;
      let numFails = 0;
      for(const [missionIdx, mission] of this.missions.entries()) {
        if ((numFails === 2) && (mission.proposals.length < 5)) {
          const numPlayersBehind = 5 - mission.proposals.length;
          const playersBehind: string[] = [];
          let proposer = mission.proposals[mission.proposals.length - 1].proposer;
          for (let idx = 0; idx < numPlayersBehind; idx++) {
            const proposerIdx = this.game.players.indexOf(proposer);
            proposer = this.game.players[(proposerIdx + 1) % this.game.players.length];
            playersBehind.push(proposer);
          }
          if (!playersBehind.every(p => this.evilPlayers.includes(p))) {
            return {
              title: 'By the skin of our teeth',
              body: `Good came close to losing on mission ${missionIdx + 1} when evil team had hammer`
            };
          }
        }
        if (mission.state === 'FAIL') {
          numFails++;
        }
      }
      return false;
    },
    psychicPowers: (): Badge | false => {
      const players = _.keyBy(this.game.players.map(name => ({
          name,
          goodProposals: 0,
          badProposals: 0
        })), 'name');
      for (const mission of this.missions) {
        for(const proposal of mission.proposals) {
          if (players[proposal.proposer]) {
            if (proposal.team.filter(n => this.evilPlayers.includes(n)).length < mission.failsRequired) {
              players[proposal.proposer].goodProposals += 1;
            } else {
              players[proposal.proposer].badProposals += 1;
            }
          }
        }
      }
      const perfectProposers = Object.values(players).filter(p => p.badProposals === 0 && p.goodProposals >= 2);
      perfectProposers.sort((a,b) => b.goodProposals - a.goodProposals);
      if (perfectProposers.length > 0) {        
        return {
          title: 'Actual Merlin',
          body: `${perfectProposers[0].name} proposed ${perfectProposers[0].goodProposals} perfect teams and no bad teams`
        };
      }
      return false;
    },
    morganaTrustsMerlin: (): Badge | false => {
      return this.roleTrustsRole('MORGANA', 'MERLIN', (msg) => ({
        title: 'Cover blown',
        body: `Morgana ${msg} with Merlin`
      }));
    },
    merlinTrustsMorgana: (): Badge | false => {
      return this.roleTrustsRole('MERLIN', 'MORGANA', (msg) => ({        
        title: 'Good luck, Percival',
        body: `Merlin ${msg} with Morgana`
        })
      );
    },
    percivalTrustsMorgana: (): Badge | false => {
      return this.roleTrustsRole('PERCIVAL', 'MORGANA', (msg) => ({        
        title: 'Got you fooled',
        body: `Percival ${msg} with Morgana`
        })
      );
    },
  };

  getBadges(): Badge[] {
    return Object.values(this.badges).map(func => {
      return func.bind(this)();
    }).filter((badge): badge is Badge => badge !== false);
  }
}