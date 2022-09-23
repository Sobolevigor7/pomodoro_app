import React, { useEffect, useState } from "react";

import { useCountdown } from "../../hooks/useCountdown";

import styles from "./TimerContainer.module.css";
import { Timer } from "./Timer";
import { useStore } from "effector-react";
import {
  $todoList,
  tick,
  remove,
  todoItemTimesDecrement,
  addTomato,
  setCurrentSession,
  timeLeftUpdate,
  stopButtonTimeLeftUpdate,
} from "../TodoListContainer/TodoList";
import { WORK_PERIOD, LONG_REST_PERIOD, REST_PERIOD } from "../Main";
import { useInterval } from "../../hooks/useInterval";
import {
  dt,
  updatePauseTime,
  updateTomatoes,
  updateTotalStops,
} from "../../GlobalStorage";
import classNames from "classnames";

enum currentStatus {
  stop = "Не работаем",
  work = "Работаем",
  rest = "Отдыхаем",
  pause = "Пауза",
}

export let storageSession: number;

export function TimerContainer() {
  const beepSound = new Audio("./beep-30b.mp3");
  const currentToDoStore = useStore($todoList); //Текущее хранение

  const [workPeriod, setWorkPeriod] = useState<number>(WORK_PERIOD);
  const [myStatus, setMyStatus] = useState<currentStatus>(
    currentToDoStore.length !== 0 &&
      currentToDoStore[0].timeLeft / currentToDoStore[0].num < WORK_PERIOD
      ? currentStatus.pause
      : currentStatus.stop
  );
  const [workIsPaused, setWorkIsPaused] = useState<boolean>(
    currentToDoStore.length !== 0 &&
      currentToDoStore[0].timeLeft / currentToDoStore[0].num < WORK_PERIOD
  );
  const [sessionNumber, setSessionNumber] = useState<number>(
    currentToDoStore.length !== 0 ? currentToDoStore[0].currentSession : 0
  );

  const setUpTime = () => {
    if (
      currentToDoStore.length !== 0 &&
      currentToDoStore[0].timeLeft / currentToDoStore[0].num < WORK_PERIOD
    ) {
      if (currentToDoStore[0].num > 1) {
        setWorkPeriod(
          currentToDoStore[0].timeLeft -
            WORK_PERIOD * (currentToDoStore[0].num - 1)
        );
      } else {
        setWorkPeriod(currentToDoStore[0].timeLeft);
      }
    } else {
      setWorkPeriod(WORK_PERIOD);
    }
  };

  useEffect(() => {
    //Выставляем значение счетчика в зависимости от ситуации (просто работаем или в процессе обновили страницу или закрыли нее)
    setUpTime();
  }, []);

  const [restPeriod, setRestPeriod] = useState<number>(REST_PERIOD); //Интервал короткого отдыха
  const [bigRestPeriod, setBigRestPeriod] = useState<number>(LONG_REST_PERIOD); //Интервал долгого отдыха
  const [intervalValue, setIntervalValue] = useState<number>(1000); // Время интервала (1 секунда)
  const [valueStartPause, setValueStartPause] = useState<string>(""); //Текст на кнопке (Старт/пауза)
  const [valueStopDone, setValueStopDone] = useState<string>(""); //Текст на кнопке (стоп/завершено)
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true); //Отключение кнопок
  const [finishCounter, setFinishCounter] = useState<boolean>(false); //Учет события окончания счетчика
  const [isOnWorkingPause, setIsOnWorkingPause] = useState<boolean>(false); //Учет времени на паузе при рабочей задаче

  const [restIsPaused, setRestIsPaused] = useState<boolean>(false); //Переключение паузы в режиме отдыха
  const [currentTimePeriod, setCurrentTimePeriod] =
    useState<number>(workPeriod);
  const [startCounter, setStartCounter] = useState<boolean>(false);

  const [
    count,
    {
      startCountdown,
      stopCountdown,
      resetCountdown,
      isCountdownRunning,
      setCount,
    },
  ] = useCountdown({
    countStart: currentTimePeriod,
    intervalMs: intervalValue,
  });

  useEffect(() => {
    if (myStatus === currentStatus.work && isCountdownRunning) {
      tick(0);
    }
  }, [count]);

  useEffect(() => {
    if (myStatus !== currentStatus.rest) {
      if (isCountdownRunning) {
        setValueStartPause("Пауза");
        setValueStopDone("Стоп");
        setButtonDisabled(false);
        setMyStatus(currentStatus.work);
        setWorkIsPaused(false);
      } else if (!isCountdownRunning && count !== 0 && workIsPaused) {
        setValueStartPause("Продолжить");
        setValueStopDone("Сделано");
        setButtonDisabled(false);
        setWorkIsPaused(true);
        setMyStatus(currentStatus.pause);
      } else if (
        !isCountdownRunning &&
        count === currentTimePeriod &&
        myStatus !== currentStatus.pause
      ) {
        setValueStartPause("Старт");
        setValueStopDone("Стоп");
        setButtonDisabled(true);
        setMyStatus(currentStatus.stop);
        setWorkIsPaused(false);
      } else if (!isCountdownRunning && count === 0) {
        setWorkIsPaused(false);
        setFinishCounter(true);
      }
    }
  }, [isCountdownRunning, count, myStatus, finishCounter, startCounter]);

  useEffect(() => {
    if (myStatus === currentStatus.rest) {
      if (isCountdownRunning) {
        setValueStartPause("Пауза");
        setValueStopDone("Пропустить");
        setButtonDisabled(false);
        setRestIsPaused(false);
      } else if (!isCountdownRunning && count !== 0) {
        setValueStartPause("Продолжить");
        setValueStopDone("Пропустить");
        setButtonDisabled(false);
      } else if (!isCountdownRunning && count === 0) {
        setFinishCounter(true);
      }
    }
  }, [
    isCountdownRunning,
    count,
    myStatus,
    finishCounter,
    startCounter,
    restIsPaused,
  ]);

  useEffect(() => {
    if (myStatus === currentStatus.work) {
      if (finishCounter) {
        setSessionNumber((session) => session + 1);
        beepSound.play();
        addTomato(0);
        updateTomatoes(dt);
        storageSession = sessionNumber + 1;
        setCurrentSession(0);
        setMyStatus(currentStatus.rest);
        setFinishCounter(false);
        todoItemTimesDecrement(0);
        if (sessionNumber < 3) {
          setCurrentTimePeriod(restPeriod);
        } else {
          setCurrentTimePeriod(bigRestPeriod);
          setSessionNumber(0);
          storageSession = 0;
          setCurrentSession(0);
        }
        setStartCounter(true);
        resetCountdown();
      }
    }
    if (myStatus === currentStatus.rest) {
      if (finishCounter) {
        beepSound.play();
        setMyStatus(currentStatus.work);
        setFinishCounter(false);
        setCurrentTimePeriod(workPeriod);
        setStartCounter(true);
        resetCountdown();
      }
    }
  }, [myStatus, finishCounter]);

  useEffect(() => {
    resetCountdown();
    setStartCounter(false);
    if (myStatus === currentStatus.rest) {
      startCountdown();
    }
  }, [startCounter]);

  const handleStartPauseButton = () => {
    if (!workIsPaused && isCountdownRunning) {
      setWorkIsPaused(true);
    } else {
      setWorkIsPaused(false);
    }
    if (!isCountdownRunning) startCountdown();
    if (isCountdownRunning) stopCountdown();
  };
  const handleStopDoneButton = () => {
    if (myStatus === currentStatus.rest) {
      setFinishCounter(true);
    } else if (workIsPaused) {
      setSessionNumber(0);
      setWorkIsPaused(false);
      setMyStatus(currentStatus.stop);
      remove(0);
    }
    if (myStatus === currentStatus.work) {
      updateTotalStops(dt);
      stopButtonTimeLeftUpdate(WORK_PERIOD - count);
      //setWorkPeriod(WORK_PERIOD);
    }
    resetCountdown();
  };

  useEffect(() => {
    if (myStatus !== currentStatus.rest) {
      setCurrentTimePeriod(workPeriod);
    }
  }, [workPeriod]);

  useEffect(() => {
    setCount(currentTimePeriod);
  }, [currentTimePeriod]);

  useEffect(() => {
    setSessionNumber(
      currentToDoStore.length !== 0 ? currentToDoStore[0].currentSession : 0
    );
    setUpTime();
  }, [
    currentToDoStore.length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    currentToDoStore.length ? currentToDoStore[0].num : false,
  ]);

  useEffect(() => {
    if (workIsPaused && myStatus === currentStatus.work) {
      setIsOnWorkingPause(true);
    } else if (!workIsPaused) {
      setIsOnWorkingPause(false);
    }
  }, [workIsPaused]);

  useInterval(
    () => {
      updatePauseTime(dt);
    },
    isOnWorkingPause ? 1000 : null
  );

  const handleAddTimeButton = () => {
    if (myStatus === currentStatus.stop) {
      setWorkPeriod((current) => current + 60);
    } else {
      setCount(count + 60);
    }
    if (myStatus !== currentStatus.rest) {
      timeLeftUpdate(0);
    }
  };

  const headerStyle = classNames(styles.timer__header, {
    [styles[`timer__header_pause`]]: myStatus === currentStatus.pause,
    [styles[`timer__header_rest`]]: myStatus === currentStatus.rest,
  });

  return (
    <>
      <div className={styles.timer__container}>
        <div className={headerStyle}>
          {currentToDoStore.length === 0 ? (
            <p></p>
          ) : (
            <div className={styles.timer__header_info}>
              {(currentToDoStore[0].num < 0 && !isCountdownRunning) ||
              (currentToDoStore[0].timeLeft <= 0 &&
                currentToDoStore[0].num === 0 &&
                !isCountdownRunning &&
                myStatus !== currentStatus.rest) ? (
                <p></p>
              ) : (
                <div className={styles.timer__header_info}>
                  <p> {currentToDoStore[0].text}</p>
                  <p>{myStatus}</p>
                  <p>Помидор {currentToDoStore[0].tomatoes}</p>
                </div>
              )}
            </div>
          )}
        </div>
        {currentToDoStore.length === 0 ? (
          <h3 className={styles.noTask__message}>Добавьте задачу</h3>
        ) : (
          <div>
            {(currentToDoStore[0].num < 0 && !isCountdownRunning) ||
            (currentToDoStore[0].timeLeft <= 0 &&
              currentToDoStore[0].num === 0 &&
              !isCountdownRunning &&
              myStatus !== currentStatus.rest) ? (
              <p className={styles.timeOut__message}>
                Время по задаче {currentToDoStore[0].text} исчерпано,
                пожалуйста, добавьте время задаче или удалите
              </p>
            ) : (
              <div>
                <Timer
                  startPauseClick={handleStartPauseButton}
                  stopDoneClick={handleStopDoneButton}
                  addTime={handleAddTimeButton}
                  valueStartPause={valueStartPause}
                  valueStopDone={valueStopDone}
                  isDisabled={buttonDisabled}
                  count={count}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
