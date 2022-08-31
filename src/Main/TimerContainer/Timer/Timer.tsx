import React, { MouseEventHandler, useEffect, useState } from "react";
import styles from "./Timer.module.css";

type Props = {
  startPauseClick: () => void;
  stopDoneClick: () => void;
  addTime: () => void;
  valueStartPause: string;
  valueStopDone: string;
  isDisabled: boolean;
  count: number;
};

export function Timer({
  startPauseClick,
  stopDoneClick,
  valueStartPause,
  valueStopDone,
  addTime,
  isDisabled,
  count,
}: Props) {
  const [minutes, setMinutes] = useState<string>("");
  const [seconds, setSeconds] = useState<string>("");
  useEffect(() => {
    setMinutes(
      Math.floor(count / 60)
        .toString()
        .padStart(2, "0")
    );
    setSeconds((count % 60).toString().padStart(2, "0"));
  }, [count]);

  return (
    <div>
      <div>СЧЕТ: {`${minutes} : ${seconds}`}</div>
      <button onClick={startPauseClick} type="button">
        {valueStartPause}
      </button>
      <button type="button" onClick={stopDoneClick} disabled={isDisabled}>
        {valueStopDone}
      </button>
      <button type="button" onClick={addTime}>
        Плюс
      </button>
    </div>
  );
}
