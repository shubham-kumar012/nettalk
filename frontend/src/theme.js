import { createTheme } from '@mui/material/styles';

// Theme styling and color palette configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#756B56',
      light: '#8E836D',
      dark: '#5C5443',
      contrastText: '#FBF9F4'
    },
    background: {
      default: '#F4F0E8',
      paper: '#FBF9F4'
    },
    text: {
      primary: '#292824',
      secondary: '#716D64',
      disabled: '#969187'
    },
    divider: '#DDD6C8',
    custom: {
      secondarySurface: '#EEE9DE',
      border: '#DDD6C8',
      mutedText: '#969187'
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      color: '#292824',
      letterSpacing: '-0.02em'
    },
    h6: {
      fontWeight: 600,
      color: '#292824',
      letterSpacing: '-0.01em'
    },
    subtitle1: {
      fontWeight: 600,
      color: '#292824'
    },
    subtitle2: {
      fontWeight: 500,
      color: '#716D64'
    },
    body1: {
      color: '#292824',
      fontSize: '0.95rem'
    },
    body2: {
      color: '#716D64',
      fontSize: '0.85rem'
    },
    caption: {
      color: '#969187',
      fontSize: '0.75rem'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 4
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none'
        }
      }
    }
  }
});

export default theme;
