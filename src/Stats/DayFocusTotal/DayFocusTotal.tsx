import React from "react";
import styles from "./dayfocustotal.module.css";

import { EIcons, Icon } from "../../Icon";
import classNames from "classnames";

type IFocus = {
  totalFocus: number;
};

export function DayFocusTotal({ totalFocus }: IFocus) {
  const focusToDisplay = Math.floor(totalFocus);
  const widgetClasses = classNames(styles.widget__container, {
    [styles.widget__container_active]: focusToDisplay > 0,
  });
  const widgetIconClasses = classNames(styles.widget__icon, {
    [styles.widget__icon_active]: focusToDisplay > 0,
  });
  return (
    <div className={widgetClasses}>
      <div>
        <p className={styles.widget__text}>Фокус</p>
        <p className={styles.widget__info}>{focusToDisplay}%</p>
      </div>
      <div>
        <Icon icon={EIcons.focus} size={129} className={widgetIconClasses} />
      </div>
    </div>
  );
}
