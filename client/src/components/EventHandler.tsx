import { useEffect, useRef, useState } from 'react';
import type AvalonGame from '../avalon.js';
import EndGameEventHandler from './EndGameEventHandler';
import MissionResultEventHandler from './MissionResultEventHandler';
import StartGameEventHandler from './StartGameEventHandler';
import Toast from './Toast';

interface EventHandlerProps {
  avalon: AvalonGame;
}

export default function EventHandler({ avalon }: EventHandlerProps) {
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
  const nextNotificationId = useRef(0);
  const lobbyName = avalon.isInLobby ? avalon.lobby.name : '';
  const userName = avalon.user?.name;

  useEffect(() => {
    if (lobbyName) document.title = `Avalon - ${lobbyName} - ${userName}`;
  }, [lobbyName, userName]);

  useEffect(() => avalon.onEvent((event: string, name: string) => {
    let message: string;
    switch (event) {
      case 'LOBBY_NEW_ADMIN':
        message = avalon.isAdmin ? 'You are now lobby administrator'
          : `${avalon.lobby.admin.name} became lobby administrator`;
        break;
      case 'PROPOSAL_REJECTED':
        message = `${avalon.game.lastProposal.proposer}'s team rejected`;
        break;
      case 'PROPOSAL_APPROVED':
        message = `${avalon.game.currentProposal.proposer}'s team approved`;
        break;
      case 'TEAM_PROPOSED':
        message = `${avalon.game.currentProposal.proposer} has proposed a team`;
        break;
      case 'PLAYER_LEFT':
        message = `${name} left the lobby`;
        break;
      case 'PLAYER_JOINED':
        message = `${name} joined the lobby`;
        break;
      case 'DISCONNECTED_FROM_LOBBY':
        message = `You've been disconnected from ${name}`;
        break;
      default:
        return;
    }
    const notification = { id: nextNotificationId.current++, message };
    setNotifications(current => [...current, notification]);
  }), [avalon]);

  return (
    <>
      {avalon.isInLobby && (
        <>
          <StartGameEventHandler avalon={avalon} />
          <MissionResultEventHandler avalon={avalon} />
          <EndGameEventHandler avalon={avalon} />
        </>
      )}
      {notifications.length > 0 && (
        <div role="status" aria-label="Game notifications">
          <Toast
            key={notifications[0].id}
            message={notifications[0].message}
            onClose={() => setNotifications(current => current.slice(1))}
          />
        </div>
      )}
    </>
  );
}
