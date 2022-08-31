import React, { useState } from "react";
import styles from "./App.module.css";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import Container from "react-bootstrap/Container";
import classNames from "classnames";
import { Main } from "./Main";
import { Stats } from "./Stats";
import { Notfound } from "./Notfound";

function App() {
  const headerClasses = classNames(
    styles["AppHeader"],
    styles["customheader"],
    "mb-4"
  );

  return (
    <Router>
      <ThemeProvider
        breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs"]}
      >
        <Container>
          <div className={styles.App}>
            <header className={headerClasses}>Заголовок приложения</header>
            <Link to="/main">Main</Link>
            <Link to="/stats">Stats</Link>
            <Switch>
              <Route exact path="/">
                <Redirect to="/main" />
              </Route>
              <Route exact path="/main">
                <Main />
              </Route>
              <Route exact path="/stats">
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
