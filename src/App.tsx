import React from "react";
import styles from "./App.module.css";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import Container from "react-bootstrap/Container";
import { Main } from "./Main";
import { Stats } from "./Stats";
import { Notfound } from "./Notfound";
import { GlobalStorage } from "./GlobalStorage";
import { EIcons, Icon } from "./Icon";
import classNames from "classnames";

import { FullReset } from "./utils/FullReset";

function App() {
  const statsIconClass = classNames(
    [styles.AppHeader__icon],
    [styles.AppHeader__icon_stats]
  );

  return (
    <Router basename="pomodorro-app.herokuapp.com/">
      <ThemeProvider
        breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs"]}
      >
        <Container>
          <div className={styles.App}>
            <header className={styles.AppHeader}>
              <GlobalStorage />
              <div>
                <Link to="/main" className={styles.AppLink}>
                  <Icon
                    icon={EIcons.tomatosmall}
                    size={40}
                    className={styles.AppHeader__icon}
                  />
                  Главная
                </Link>
              </div>
              <FullReset />
              <div>
                <Link to="/stats" className={styles.AppLink}>
                  <Icon
                    icon={EIcons.statsicon}
                    size={24}
                    className={statsIconClass}
                  />
                  Статистика
                </Link>
              </div>
            </header>

            <Switch>
              <Route exact path="/">
                <Redirect to="/main" />
              </Route>
              <Route path="/main">
                <Main />
              </Route>
              <Route path="/stats">
                <Stats />
              </Route>
              <Route path="*">
                <Notfound />
              </Route>
            </Switch>
          </div>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
