import React, { useEffect, useState } from "react";
import { insert } from "../TodoListInput";

import styles from "./todolist.module.css";
import { createEvent, createStore } from "effector";
import connectLocalStorage from "effector-localstorage";
import { useList, useStore } from "effector-react";
import Dropdown from "react-bootstrap/Dropdown";
import classNames from "classnames";
import { EIcons, Icon } from "../../../Icon";
import { WORK_PERIOD } from "../../Main";
import { storageSession } from "../../TimerContainer";
import { DeleteTask } from "../../../utils/DeleteTask";

interface Itodo {
  text: string;
  done: boolean;
  num: number;
  readonly: boolean;
  timeLeft: number;
  tomatoes: number;
  currentSession: any;
}

export const remove = createEvent<number>("remove");
export const todoItemTimesIncrement = createEvent<number>(
  "todoItemTimesIncrement"
);
export const todoItemTimesDecrement = createEvent<number>(
  "todoItemTimesDecrement"
);
const editTodoToggle = createEvent<number>("editTodoToggle");
const todoChange = createEvent<any>("todoChange");
const todoBlur = createEvent<number>("todoBlur");
export const tick = createEvent<number>("tick");
export const timeLeftUpdate = createEvent<number>("timeLeftUpdate");
export const stopButtonTimeLeftUpdate = createEvent<number>(
  "stopButtonTimeLeftUpdate"
);
export const addTomato = createEvent<number>("addTomato");
export const setCurrentSession = createEvent<any>("setCurrentSession");
export const resetTodo = createEvent("resetTodo");

const todoListLocalStorage = connectLocalStorage("$todoList").onError((err) =>
  console.log(err)
);

export const $todoList = createStore<Itodo[]>(todoListLocalStorage.init() || [])
  .on(remove, (todos, index) =>
    todos.filter((state: any, i: number) => i !== index)
  )
  .on(todoItemTimesIncrement, (list, id) =>
    list.map((todo, i) => {
      if (i === id)
        return {
          ...todo,
          num: todo.num + 1,
          timeLeft: (todo.num + 1) * WORK_PERIOD,
        };
      return todo;
    })
  )
  .on(todoItemTimesDecrement, (list, id) =>
    list.map((todo, i) => {
      if (i === id)
        return {
          ...todo,
          num: todo.num - 1,
          timeLeft: (todo.num - 1) * WORK_PERIOD,
        };
      return todo;
    })
  )
  .on(insert, (list, e) => [
    ...list,
    {
      text: e,
      done: false,
      num: 1,
      readonly: true,
      timeLeft: WORK_PERIOD,
      tomatoes: 0,
      currentSession: 0,
    },
  ])
  .on(editTodoToggle, (list, id) =>
    list.map((todo, i) => {
      if (i === id)
        return {
          ...todo,
          readonly: !todo.readonly,
        };
      return todo;
    })
  )
  .on(todoChange, (list, e) =>
    list.map((todo, i) => {
      if (i === e.index)
        return {
          ...todo,
          text: e.event.currentTarget.value,
        };
      return todo;
    })
  )
  .on(todoBlur, (list, id) =>
    list.map((todo, i) => {
      if (i === id)
        return {
          ...todo,
          readonly: true,
        };
      return todo;
    })
  )
  .on(tick, (list, id) =>
    list.map((todo, i) => {
      if (i === id)
        return {
          ...todo,

          timeLeft: todo.timeLeft - 1,
        };
      return todo;
    })
  )
  .on(timeLeftUpdate, (list, id) =>
    list.map((todo, i) => {
      if (i === id)
        return {
          ...todo,
          timeLeft: todo.timeLeft + 60,
        };
      return todo;
    })
  )
  .on(stopButtonTimeLeftUpdate, (list, timeAdd) =>
    list.map((todo, i) => {
      if (i === 0)
        return {
          ...todo,
          timeLeft: todo.timeLeft + timeAdd,
        };
      return todo;
    })
  )

  .on(addTomato, (list, id) =>
    list.map((todo, i) => {
      if (i === id)
        return {
          ...todo,
          tomatoes: todo.tomatoes + 1,
        };
      return todo;
    })
  )
  .on(setCurrentSession, (list, id) =>
    list.map((todo, i) => {
      if (i === id)
        return {
          ...todo,
          currentSession: storageSession,
        };
      return todo;
    })
  )
  .on(resetTodo, (todos) =>
    todos.filter((state: any, i: number) => i === Infinity)
  );

$todoList.watch(todoListLocalStorage);

export function TodoList() {
  const [arrowElement, setArrowElement] = useState<null | HTMLElement>(null);

  const handleFocus = (index: number) => {
    document.getElementById("todo" + index.toString())?.focus();
  };

  let allTasksAmountOfTime = useStore($todoList).reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue.timeLeft;
    },
    0
  );

  /*
  Перевод общего времени в часы и минуты
   */

  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<string>("");
  useEffect(() => {
    setHours(Math.floor(allTasksAmountOfTime / 60 / 60));
    setMinutes(
      Math.round((allTasksAmountOfTime / 60) % 60)
        .toString()
        .padStart(2, "0")
    );
  }, [allTasksAmountOfTime]);

  const listItemClass = classNames(
    "d-flex",
    "justify-content-between",
    "align-items-start",
    styles["listItem"]
  );
  const plusButtonClass = classNames(
    styles["menuButton"],
    styles["plusButton"]
  );
  const minusButtonClass = classNames(
    styles["menuButton"],
    styles["minusButton"]
  );
  const editButtonClass = classNames(
    styles["menuButton"],
    styles["editButton"]
  );
  const deleteButtonClass = classNames(
    styles["menuButton"],
    styles["deleteButton"]
  );

  const todos = useList($todoList, ({ text, done, num, readonly }, index) => (
    <li className={listItemClass}>
      <div className={styles.todoListValueWrap}>
        <span className={styles.todoListTimes}>{num}</span>
        <form
          className={styles.todoListValueForm}
          onSubmit={(event) => {
            event.preventDefault();
            editTodoToggle(index);
          }}
          onBlur={() => {
            todoBlur(index);
          }}
        >
          <input
            className={styles.todoListValue}
            type="text"
            value={text}
            readOnly={readonly}
            onChange={(event) => todoChange({ event, index, text })}
            id={"todo" + index.toString()}
          />
        </form>
      </div>

      <Dropdown className={"dropdown-center"} autoClose="outside">
        <Dropdown.Toggle
          variant="outline-light"
          className={styles.dropdownToggle}
        >
          <Icon icon={EIcons.menu} size={26} />
        </Dropdown.Toggle>

        <Dropdown.Menu
          flip={true}
          className={"dropdown-menu-center"}
          popperConfig={{
            modifiers: [
              {
                name: "offset",
                enabled: true,
                options: {
                  offset: [-50, 10],
                },
              },
              {
                name: "arrow",
                options: {
                  enabled: true,
                  padding: 5,
                  element: arrowElement,
                },
              },
            ],
          }}
        >
          <span className={styles.todoMenuArrow} ref={setArrowElement} />
          <Dropdown.Item>
            <button
              type="button"
              onClick={() => todoItemTimesIncrement(index)}
              className={plusButtonClass}
            >
              <Icon icon={EIcons.plus} className={styles.buttonImg} size={18} />
              Увеличить
            </button>
          </Dropdown.Item>
          <Dropdown.Item>
            <button
              type="button"
              onClick={() => todoItemTimesDecrement(index)}
              disabled={num < 2}
              className={minusButtonClass}
            >
              {num < 2 && (
                <Icon
                  icon={EIcons.minusdisabled}
                  className={styles.buttonImg}
                  size={18}
                />
              )}
              {num >= 2 && (
                <Icon
                  icon={EIcons.minusactive}
                  className={styles.buttonImg}
                  size={18}
                />
              )}
              Уменьшить
            </button>
          </Dropdown.Item>
          <Dropdown.Item>
            <button
              className={editButtonClass}
              type="button"
              onClick={() => {
                editTodoToggle(index);
                handleFocus(index);
              }}
            >
              <Icon icon={EIcons.edit} className={styles.buttonImg} size={18} />
              Редактировать
            </button>
          </Dropdown.Item>

          <Dropdown.Item>
            <DeleteTask index={index} />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  ));

  return (
    <>
      <ul className={styles.todoList}>{todos}</ul>
      <span className={styles.totalTime}>
        {hours > 0 && `${hours} час `}
        {minutes !== "00" && `${minutes} мин`}
      </span>
    </>
  );
}
