import React, { useEffect, useState } from "react";
import styles from "./daytomatoestotal.module.css";
import { EIcons, Icon } from "../../Icon";
import classNames from "classnames";

type ITomatoes = {
  totalTomatoes: number;
};

export function DayTomatoesTotal({ totalTomatoes }: ITomatoes) {
  const containerWithInfo = classNames(
    styles["widget__container"],
    styles["widget__containerWithInfo"]
  );
  const [expression, setExpression] = useState<string>("помидор");

  const tomatoesLastNumber = parseInt(
    totalTomatoes.toString(10).slice(totalTomatoes.toString(10).length - 1)
  );
  const tomatoesTwoLastNumbers = parseInt(
    totalTomatoes.toString(10).slice(totalTomatoes.toString(10).length - 2)
  );

  useEffect(() => {
    //Склоняем окончания в зависимости от количества помидорОВ или помидорА
    if (
      (totalTomatoes > 1 && totalTomatoes < 5) ||
      (totalTomatoes > 21 &&
        tomatoesLastNumber < 5 &&
        tomatoesLastNumber > 1) ||
      (totalTomatoes > 99 &&
        tomatoesTwoLastNumbers > 21 &&
        tomatoesLastNumber < 5)
    ) {
      setExpression("помидора");
    }
    if (
      (totalTomatoes > 4 && totalTomatoes < 21) ||
      (totalTomatoes > 21 && tomatoesLastNumber > 4) ||
      (totalTomatoes > 21 && tomatoesLastNumber === 0) ||
      (totalTomatoes > 99 && tomatoesTwoLastNumbers < 2)
    ) {
      setExpression("помидоров");
    }
    if (
      totalTomatoes === 1 ||
      (totalTomatoes > 99 &&
        tomatoesTwoLastNumbers > 20 &&
        tomatoesLastNumber < 2) ||
      (totalTomatoes > 99 &&
        tomatoesTwoLastNumbers < 2 &&
        tomatoesLastNumber < 2) ||
      (totalTomatoes > 21 && totalTomatoes < 99 && tomatoesLastNumber === 1)
    ) {
      setExpression("помидор");
    }
  }, [totalTomatoes]);

  return (
    <>
      {totalTomatoes > 0 && (
        <div>
          <div className={containerWithInfo}>
            <p>
              <Icon icon={EIcons.tomato1} size={81} />
              <span className={styles.widget__totalTomatoes}>
                {" "}
                x {totalTomatoes}{" "}
              </span>
            </p>
          </div>
          <div className={styles.widget__totalTomatoesFooter}>
            {" "}
            {totalTomatoes} {expression}
          </div>
        </div>
      )}

      {(totalTomatoes === 0 || !totalTomatoes) && (
        <div className={styles.widget__container}>
          <Icon
            icon={EIcons.tomato2}
            size={115}
            className={styles.widget__tomato2}
          />
        </div>
      )}
    </>
  );
}
