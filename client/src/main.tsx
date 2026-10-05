import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';

const theme = createTheme({
  palette: { primary: { main: '#303f9f' } },
  typography: { fontFamily: 'Roboto, Arial, sans-serif' },
});

const root = document.getElementById('app');
if (!root) throw new Error('Missing application root');

createRoot(root).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
