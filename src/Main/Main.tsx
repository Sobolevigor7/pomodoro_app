import React from "react";
import styles from "./Main.module.css";
import { TimerContainer } from "./TimerContainer";
import { TodoListContainer } from "./TodoListContainer";
import Container from "react-bootstrap/Container";

export const WORK_PERIOD: number = 1500; //1500
export const REST_PERIOD: number = 180; //180
export const LONG_REST_PERIOD: number = 900;

export function Main() {
  return (
    <Container className={styles.container}>
      <TodoListContainer />

      <TimerContainer />
    </Container>
  );
}
