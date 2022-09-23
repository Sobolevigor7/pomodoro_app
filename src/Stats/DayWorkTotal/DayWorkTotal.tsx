import React, { useEffect, useState } from "react";
import styles from "./dayworktotal.module.css";
import formatDuration from "date-fns/formatDuration";

import { ru } from "date-fns/locale";

interface IProps {
  weekDay: string;
  totalWorkTime: number;
}

export function DayWorkTotal({ weekDay, totalWorkTime }: IProps) {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  useEffect(() => {
    setHours(Math.trunc(Math.floor(totalWorkTime / 60 / 60)));
    setMinutes(Math.trunc(Math.floor(totalWorkTime / 60) % 60));
  }, [totalWorkTime]);

  const duration = formatDuration(
    { hours: hours, minutes: minutes },
    {
      format: ["hours", "minutes", "seconds"],
      locale: ru,
    }
  );

  return (
    <div className={styles.widget__container}>
      <p className={styles.widget__weekDay}>{weekDay}</p>
      {totalWorkTime !== 0 ? (
        totalWorkTime > 60 ? (
          <div className={styles.widget__info}>
            <span className={styles.widget__text}>
              Время работы над задачами:
            </span>
            <p className={styles.widget__time}>{duration}</p>
          </div>
        ) : (
          <div className={styles.widget__info}>
            <p className={styles.widget__text}>
              Вы работали над задачами меньше минуты
            </p>
          </div>
        )
      ) : (
        <p>Нет данных</p>
      )}
    </div>
  );
}
