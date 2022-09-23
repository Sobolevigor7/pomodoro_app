import React from "react";
import styles from "./todolistcontainer.module.css";
import { TodoListInput } from "./TodoListInput";
import { TodoList } from "./TodoList";

export function TodoListContainer() {
  return (
    <div className={styles.container}>
      <TodoListInput />
      <TodoList />
    </div>
  );
}
