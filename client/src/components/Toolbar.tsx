import React from 'react';
import { AppBar, Toolbar as MuiToolbar, Typography, Box, IconButton } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import ToolbarQuitButton from './ToolbarQuitButton';
import ViewRoleButton from './ViewRoleButton';
import LogoutButton from './LogoutButton';

interface User {
  name: string;
  email: string;
}

interface Lobby {
  name: string;
}

interface AvalonProps {
  user: User;
  lobby?: Lobby | null;
}

interface ToolbarProps {
  avalon: AvalonProps;
}

const Toolbar: React.FC<ToolbarProps> = ({ avalon }) => {
  const isInLobby = avalon.lobby && avalon.lobby.name && avalon.user && avalon.user.name;

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1565C0' }}>
      <MuiToolbar>
        {isInLobby ? (
          <>
            <IconButton edge="start" color="inherit" aria-label="room">
              <RoomIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#B2EBF2', flexGrow: 0 }}>
              {avalon.lobby!.name}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <ViewRoleButton avalon={avalon as any} />
            <Box sx={{ flexGrow: 1 }} />
            <ToolbarQuitButton avalon={avalon as any} />
          </>
        ) : (
          <>
            <Typography variant="body1">{avalon.user.email}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <LogoutButton avalon={avalon as any} />
          </>
        )}
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
