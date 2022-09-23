import React from "react";
import styles from "./todolistinput.module.css";
import { createStore, createEvent, sample } from "effector";
import { useStore } from "effector-react";

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
      <div className={styles.todoInput__description}>
        <h2>Таймер задач.</h2>
        <ul>
          <li className={styles.todoInput__list}>Введите название задачи</li>
          <li className={styles.todoInput__list}>
            Добавьте время на выполнение задачи (помидор)
          </li>
          <li className={styles.todoInput__list}>
            Работайте, пока "помидор" не прозвонит
          </li>
          <li className={styles.todoInput__list}>
            Сделайте короткий перерыв (3 минуты)
          </li>
          <li className={styles.todoInput__list}>
            Продолжайте работать "помидор" за "помидором"
          </li>
          <li className={styles.todoInput__list}>
            Каждые 4 "помидора" делайте длинный перерыв (15 минут)
          </li>
          <li className={styles.todoInput__list}>
            Кнопка Сброс Статистики - полный сброс задач и статистики работы
          </li>
        </ul>
      </div>
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
