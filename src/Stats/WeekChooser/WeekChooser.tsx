import React, { useEffect, useState } from "react";
import styles from "./weekchooser.module.css";
import Select, { IndicatorSeparatorProps } from "react-select";
import isThisWeek from "date-fns/isThisWeek";
import format from "date-fns/format";
import { ru } from "date-fns/locale";
import addDays from "date-fns/addDays";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

const indicatorSeparatorStyle = {
  display: "none",
};

const IndicatorSeparator = ({ innerProps }: IndicatorSeparatorProps) => {
  return <span style={indicatorSeparatorStyle} {...innerProps} />;
};

export function WeekChooser({
  weeksArray,
  handleWeekChange,
  defaultWeek,
}: any) {
  const [selectedOption, setSelectedOption] = useState<any>(null);

  useEffect(() => {
    if (weeksArray.length !== 0) {
      for (let i = 0; i < weeksArray.length; i++) {
        weeksArray[i].label =
          format(weeksArray[i].value, "eeee do LLL uu", { locale: ru }) +
          " - " +
          format(addDays(weeksArray[i].value, 6), "eeee do LLL uu", {
            locale: ru,
          });

        if (isThisWeek(weeksArray[i].value, { weekStartsOn: 1 })) {
          weeksArray[i].label = "Эта неделя";
          if (weeksArray[i - 1]) {
            if (
              differenceInCalendarDays(
                weeksArray[i].value,
                weeksArray[i - 1].value
              ) === 7
            ) {
              weeksArray[i - 1].label = "Прошедшая неделя";
            } else if (
              differenceInCalendarDays(
                weeksArray[i].value,
                weeksArray[i - 1].value
              ) === 14
            ) {
              weeksArray[i - 1].label = "2 недели назад";
            }
          }
          if (weeksArray[i - 2]) {
            if (
              differenceInCalendarDays(
                weeksArray[i].value,
                weeksArray[i - 2].value
              ) === 14
            ) {
              weeksArray[i - 2].label = "2 недели назад";
            } else if (
              differenceInCalendarDays(
                weeksArray[i].value,
                weeksArray[i - 2].value
              ) === 7
            ) {
              weeksArray[i - 2].label = "Прошедшая неделя";
            }
          }
        }
      }
    }
  }, [weeksArray]);

  useEffect(() => {
    setSelectedOption(weeksArray[defaultWeek]);
  }, [weeksArray]);

  return (
    <div className={styles.weekChooser__container}>
      {selectedOption ? (
        <Select
          defaultValue={selectedOption ? selectedOption : null}
          options={weeksArray}
          onChange={handleWeekChange}
          components={{ IndicatorSeparator }}
          className={styles.weekChooser}
          classNamePrefix={"customChooser"}
        />
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}
