import React, { useEffect, useState } from "react";
import styles from "./GamePlayerList.module.css";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faCrown, faVoteYea } from '@fortawesome/free-solid-svg-icons';

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

interface GamePlayerListProps {
	avalon: AvalonData;
	onSelectedPlayers: (players: string[]) => void;
}

function joinWithAnd(array: string[]): string {
	if (array.length === 0) return "";
	if (array.length === 1) return array[0];
	const arrCopy = array.slice(0);
	const lastElement = arrCopy.pop();
	return arrCopy.join(", ") + " and " + lastElement;
}

export default function GamePlayerList({
	avalon,
	onSelectedPlayers,
}: GamePlayerListProps) {
	const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

	const crownColor = avalon.game.currentProposalIdx < 4 ? "#fcfc00" : "#cc0808";

	const enableCheckboxes = (name: string): boolean => {
		return (
			(avalon.game.phase === "TEAM_PROPOSAL" &&
				avalon.game.currentProposer === avalon.user?.name) ||
			(avalon.game.phase === "ASSASSINATION" &&
				avalon.lobby?.role?.assassin &&
				name !== avalon.user?.name)
		);
	};

	const selectedForMission = (name: string): boolean => {
		return (
			(avalon.game.phase === "PROPOSAL_VOTE" ||
				avalon.game.phase === "MISSION_VOTE") &&
			avalon.game.currentProposal?.team?.includes(name)
		);
	};

	const hasVoted = (name: string): boolean => {
		return (
			avalon.game.phase === "PROPOSAL_VOTE" &&
			avalon.game.currentProposal?.votes?.includes(name)
		);
	};

	const waitingOnVote = (name: string): boolean => {
		return (
			avalon.game.phase === "PROPOSAL_VOTE" &&
			!avalon.game.currentProposal?.votes?.includes(name)
		);
	};

	const wasOnLastTeamProposed = (name: string): boolean => {
		switch (avalon.game.phase) {
			case "TEAM_PROPOSAL":
			case "ASSASSINATION":
				return (
					avalon.game.lastProposal &&
					avalon.game.lastProposal.team.includes(name)
				);
			case "PROPOSAL_VOTE":
			case "MISSION_VOTE":
				return avalon.game.currentProposal?.team?.includes(name) || false;
			default:
				console.error("Unhandled game phase", avalon.game.phase);
				return false;
		}
	};

	const approvedProposal = (name: string): boolean => {
		if (
			avalon.game.phase === "TEAM_PROPOSAL" ||
			avalon.game.phase === "ASSASSINATION"
		) {
			return (
				avalon.game.lastProposal &&
				avalon.game.lastProposal.votes.includes(name)
			);
		} else if (avalon.game.phase === "MISSION_VOTE") {
			return avalon.game.currentProposal?.votes?.includes(name) || false;
		}
		return false;
	};

	const rejectedProposal = (name: string): boolean => {
		if (
			avalon.game.phase === "TEAM_PROPOSAL" ||
			avalon.game.phase === "ASSASSINATION"
		) {
			return (
				avalon.game.lastProposal &&
				!avalon.game.lastProposal.votes.includes(name)
			);
		} else if (avalon.game.phase === "MISSION_VOTE") {
			return !avalon.game.currentProposal?.votes?.includes(name);
		}
		return false;
	};

	const tooltipText = (name: string): string | null => {
		const states: string[] = [];
		if (wasOnLastTeamProposed(name)) {
			states.push("was on the last proposed team");
		}

		if (waitingOnVote(name)) {
			states.push("is currently voting on the proposal");
		} else if (hasVoted(name)) {
			states.push("has submitted a vote for the proposed team");
		} else if (approvedProposal(name)) {
			states.push("approved the last team");
		} else if (rejectedProposal(name)) {
			states.push("rejected the last team");
		}

		if (states.length === 0) return null;

		return name + " " + joinWithAnd(states);
	};

	const handleCheckboxChange = (playerName: string, checked: boolean) => {
		setSelectedPlayers((prev) => {
			let newSelection: string[];
			if (checked) {
				newSelection = [...prev, playerName];
			} else {
				newSelection = prev.filter((p) => p !== playerName);
			}

			let maxSelected = 1;
			if (avalon.game.phase === "TEAM_PROPOSAL") {
				maxSelected = avalon.game.currentMission.teamSize;
			}

			if (newSelection.length > maxSelected) {
				newSelection.shift();
			}

			return newSelection;
		});
	};

	useEffect(() => {
		onSelectedPlayers(selectedPlayers);
	}, [selectedPlayers, onSelectedPlayers]);

	useEffect(() => {
		setSelectedPlayers([]);
	}, [avalon.game.phase]);

	return (
		<div className={styles.playerList}>
			{avalon.game.players.map((playerName) => (
				<div key={playerName} className={styles.playerItem}>
					<div className={styles.checkboxColumn}>
						{enableCheckboxes(playerName) && (
							<input
								type="checkbox"
								className={styles.checkbox}
								checked={selectedPlayers.includes(playerName)}
								onChange={(e) =>
									handleCheckboxChange(playerName, e.target.checked)
								}
							/>
						)}
						{selectedForMission(playerName) && (
							<input
								type="checkbox"
								className={`${styles.checkbox} ${styles.selectedForMission}`}
								checked={true}
								readOnly
							/>
						)}
					</div>

					<div className={styles.statusColumn}>
						{avalon.game.currentProposer === playerName && (
							<div
								className={styles.crownContainer}
								title={`${playerName} is proposing the next team`}
							>
								<span
									className={styles.crown}
									style={{ color: crownColor }}
								><FontAwesomeIcon icon={faCrown} /></span>
								<span className={styles.proposalNumber}>
									{avalon.game.currentProposalIdx + 1}
								</span>
							</div>
						)}
						{playerName === avalon.game.hammer &&
							avalon.game.currentProposer !== playerName && (
								<div className={styles.hammerContainer}>
									<span className={styles.hammer}><FontAwesomeIcon icon={faHammer} /></span>
								</div>
							)}
					</div>

					<div className={styles.nameColumn}>{playerName}</div>

					<div className={styles.iconColumn}>
						{tooltipText(playerName) && (
							<div
								className={styles.statusIcons}
								title={tooltipText(playerName) || ""}
							>
								{wasOnLastTeamProposed(playerName) && (
									<span className={styles.teamIcon}><RadioButtonUncheckedIcon /></span>
								)}
								{waitingOnVote(playerName) && (
									<span className={styles.waitingIcon}><MoreHorizIcon /></span>
								)}
								{hasVoted(playerName) && !waitingOnVote(playerName) && (
									<span className={styles.votedIcon}><FontAwesomeIcon icon={faVoteYea} /></span>
								)}
								{approvedProposal(playerName) &&
									!hasVoted(playerName) &&
									!waitingOnVote(playerName) && (
										<span className={styles.approvedIcon}><ThumbUpIcon /></span>
									)}
								{rejectedProposal(playerName) &&
									!hasVoted(playerName) &&
									!waitingOnVote(playerName) && (
										<span className={styles.rejectedIcon}><ThumbDownIcon /></span>
									)}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
