import React, {
  ChangeEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useInterval } from "../../hooks/useInterval";
import { useCountdown } from "../../hooks/useCountdown";

import styles from "./TimerContainer.module.css";
import { Timer } from "./Timer";
import { useStore } from "effector-react";
import { $todoList } from "../TodoListContainer/TodoList";

enum currentStatus {
  stop = "stop",
  work = "work",
  rest = "rest",
  pause = "pause",
}

export function TimerContainer() {
  const [workPeriod, setWorkPeriod] = useState<number>(2);
  const [restPeriod, setRestPeriod] = useState<number>(5);
  const [bigRestPeriod, setBigRestPeriod] = useState<number>(20);
  const [intervalValue, setIntervalValue] = useState<number>(1000);
  const [valueStartPause, setValueStartPause] = useState<string>("");
  const [valueStopDone, setValueStopDone] = useState<string>("");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [myStatus, setMyStatus] = useState<currentStatus>(currentStatus.stop);
  const [sessionNumber, setSessionNumber] = useState<number>(0);
  const [finishCounter, setFinishCounter] = useState<boolean>(false);
  const [workIsPaused, setWorkIsPaused] = useState<boolean>(false);
  const [restIsPaused, setRestIsPaused] = useState<boolean>(false);
  const [currentTimePeriod, setCurrentTimePeriod] =
    useState<number>(workPeriod);
  const [startCounter, setStartCounter] = useState<boolean>(false);
  const currentStore = useStore($todoList); //Текущее хранение
  console.log(currentStore); //Текущее хранение
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
      console.log("Номер сессии", sessionNumber);
      if (finishCounter) {
        setSessionNumber((session) => session + 1);
        setMyStatus(currentStatus.rest);
        setFinishCounter(false);
        if (sessionNumber < 3) {
          setCurrentTimePeriod(restPeriod);
        } else {
          setCurrentTimePeriod(bigRestPeriod);
          setSessionNumber(0);
          console.log("Session finished");
        }
        setStartCounter(true);
        resetCountdown();
      }
    }
    if (myStatus === currentStatus.rest) {
      if (finishCounter) {
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
      console.log("work done");
      setSessionNumber(0);
    }
    resetCountdown();
  };

  useEffect(() => {
    setCurrentTimePeriod(workPeriod);
  }, [workPeriod]);

  useEffect(() => {
    setCount(currentTimePeriod);
  }, [currentTimePeriod]);

  const handleAddTimeButton = () => {
    if (myStatus === currentStatus.stop) {
      setWorkPeriod((current) => current + 1);
    } else setCount(count + 1);
  };

  return (
    <div>
      <p>{myStatus}</p>
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
  );
}
