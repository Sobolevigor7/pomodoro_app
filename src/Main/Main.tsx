import React from "react";
import styles from "./Main.module.css";
import { TimerContainer } from "./TimerContainer";
import { TodoListContainer } from "./TodoListContainer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export function Main() {
  return (
    <Container>
      Main
      <Row>
        <Col>
          <TodoListContainer />
        </Col>
        <Col>
          <TimerContainer />
        </Col>
      </Row>
    </Container>
  );
}
