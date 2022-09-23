import React, { useEffect, useState } from "react";
import styles from "./daypausetotal.module.css";
import { EIcons, Icon } from "../../Icon";
import classNames from "classnames";

type IPause = {
  totalPause: number;
};

export function DayPauseTotal({ totalPause }: IPause) {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  useEffect(() => {
    setHours(Math.floor(totalPause / 60 / 60));
    setMinutes(Math.round(totalPause / 60) % 60);
  }, [totalPause]);

  const widgetClasses = classNames(styles.widget__container, {
    [styles.widget__container_active]: minutes > 0,
  });
  const widgetIconClasses = classNames(styles.widget__icon, {
    [styles.widget__icon_active]: minutes > 0,
  });

  return (
    <div className={widgetClasses}>
      <div>
        <p className={styles.widget__text}>Время на паузе</p>
        <p className={styles.widget__info}>
          {hours > 0 ? `${hours}ч ` : ``}
          {minutes > 0 ? `${minutes}м` : `0м`}
        </p>
      </div>
      <div>
        <Icon icon={EIcons.pause} size={129} className={widgetIconClasses} />
      </div>
    </div>
  );
}
