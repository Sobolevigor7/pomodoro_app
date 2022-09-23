import React from "react";
import styles from "./daystopstotal.module.css";
import { EIcons, Icon } from "../../Icon";
import classNames from "classnames";

type IFocus = {
  totalStops: number;
};

export function DayStopsTotal({ totalStops }: IFocus) {
  const widgetClasses = classNames(styles.widget__container, {
    [styles.widget__container_active]: totalStops > 0,
  });
  const widgetIconClasses = classNames(styles.widget__icon, {
    [styles.widget__icon_active]: totalStops > 0,
  });
  return (
    <div className={widgetClasses}>
      <div>
        <p className={styles.widget__text}>Остановки</p>
        <p className={styles.widget__info}>{totalStops}</p>
      </div>
      <div>
        <Icon icon={EIcons.stop} size={129} className={widgetIconClasses} />
      </div>
    </div>
  );
}
