import { createMuiTheme } from '@material-ui/core/styles';

const headerFont = 'NSMMarket,"Brandon Grotesque Regular", "Georgia", "serif"';
const regularFont = '"Brandon Grotesque Regular", "Georgia", "serif"';

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: '#aab437',
      main: '#cedb00',
    },
  },

  typography: {
    h1: {
      fontFamily: headerFont,
    },
    h2: {
      fontFamily: headerFont,
    },
    h3: {
      fontFamily: headerFont,
    },
    h4: {
      fontFamily: headerFont,
    },
    h5: {
      fontFamily: headerFont,
    },
    h6: {
      fontFamily: headerFont,
    },
    button: {
      fontFamily: headerFont,
    },
    fontFamily: regularFont,
  },
});

export default theme;
