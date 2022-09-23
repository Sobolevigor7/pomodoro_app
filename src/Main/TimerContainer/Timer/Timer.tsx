import React, { useEffect, useState } from "react";
import styles from "./Timer.module.css";
import classNames from "classnames";
import { EIcons, Icon } from "../../../Icon";

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

  const stopDoneStyle = classNames(styles.timerButton, styles.timerStopButton);
  const startStopStyle = classNames(
    styles.timerButton,
    styles.timerStartButton
  );

  return (
    <div>
      <div className={styles.timerGroup}>
        <div className={styles.timer}> {`${minutes} : ${seconds}`}</div>
        <button type="button" className={styles.plusButton} onClick={addTime}>
          <Icon icon={EIcons.plustime} size={50} className={styles.plusIcon} />
        </button>
      </div>
      <button
        onClick={startPauseClick}
        type="button"
        className={startStopStyle}
      >
        {valueStartPause}
      </button>
      <button
        className={stopDoneStyle}
        type="button"
        onClick={stopDoneClick}
        disabled={isDisabled}
      >
        {valueStopDone}
      </button>
    </div>
  );
}
