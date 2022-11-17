import { Container, createMuiTheme, makeStyles, ThemeProvider, Toolbar } from '@material-ui/core';
import PointsCard from '../leaderboard/PointCard';
import League from '../league/League';
import Header from '../misc/Header';

const useStyles = makeStyles({
  logo: {
    maxHeight: '15vw'
  },
  homepage: {
    position: 'relative',
    left: 0,
    width: '100%'
  }
});

export const fontTheme = createMuiTheme({
  typography: {
    fontFamily: [
      'Source Sans Pro',
      'sans-serif',
    ].join(','),
  },
});

function Homepage() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={fontTheme}>
      <Header />
      <Toolbar/>
      <Container className={classes.homepage} maxWidth="xs">
        {/* <PointsCard /> */}
        <League />
      </Container>
    </ThemeProvider>
  )
}

export default Homepage;