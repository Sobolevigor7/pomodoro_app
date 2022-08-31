import React from "react";
import styles from "./todolistinput.module.css";
import { createStore, createEvent, sample } from "effector";
import { useStore, useList } from "effector-react";

export const insert = createEvent<any>("insert");
export const change = createEvent<string>("change");
const reset = createEvent("resetField");
export const $input = createStore<string>("")
  .on(change, (state, value) => value)
  .reset(reset, insert);

const submit = createEvent<React.SyntheticEvent>();
submit.watch((event) => {
  event.preventDefault();
});

sample({
  clock: submit,
  source: $input,
  target: insert,
});

export function TodoListInput() {
  const input = useStore($input);
  return (
    <div className={styles.container}>
      <p>TodoList Input</p>
      <input
        className={styles.inputField}
        id={"todo-input"}
        placeholder={"Название задачи"}
        type="text"
        value={input}
        onChange={(event) => change(event.currentTarget.value)}
      />
      <input
        className={styles.inputButton}
        disabled={!input}
        type="submit"
        onClick={submit}
        value="Добавить"
      />
    </div>
  );
}
