import React, { useEffect, useState } from "react";
import styles from "./Stats.module.css";
import { useStore } from "effector-react";
import { $global } from "../GlobalStorage";
import min from "date-fns/min";
import max from "date-fns/max";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";
import add from "date-fns/add";
import { BarChart } from "./BarChart";
import { WeekChooser } from "./WeekChooser";
import { SingleValue } from "react-select";
import { DayWorkTotal } from "./DayWorkTotal";
import { DayTomatoesTotal } from "./DayTomatoesTotal";
import { DayFocusTotal } from "./DayFocusTotal";
import { DayPauseTotal } from "./DayPauseTotal";
import { DayStopsTotal } from "./DayStopsTotal";

export interface ICurDate {
  weekOfTheSession?: Date | undefined;
  weekDay?: string;
  dateOfSession?: Date | undefined;
  sessionDay?: Date | undefined;
  totalTomatoes?: number;
  totalStops?: number;
  totalPause?: number;
  totalAppActiveTime?: number;
  totalWorkTime?: number;
}

export function Stats() {
  const globalStorage = useStore($global);
  const [arrayToDisplayStatistics, setArrayToDisplayStatistics] = useState<
    Array<ICurDate>
  >([]);
  const [weekListOptions, setWeekListOptions] = useState<Array<any>>([]);
  const [defaultWeek, setDefaultWeek] = useState(0);
  const [chartData, setChartData] = useState<Array<number>>([]);
  const [initial, setInitial] = useState<boolean>(true);
  const [selectedWeekDay, setSelectedWeekDay] = useState<string>("Понедельник");
  const [selectedWeek, setSelectedWeek] = useState<Date>();
  const [dayDataToDisplay, setDayDataToDisplay] = useState<Array<ICurDate>>([]);
  const [dayOfWeekToDisplay, setDayOfWeekToDisplay] = useState<string>("");
  const [dayWorkTimeToDisplay, setDayWorkTimeToDisplay] = useState<number>(0);
  const [dayTomatoesToDisplay, setDayTomatoesToDisplay] = useState<number>(0);
  const [dayFocusToDisplay, setDayFocusToDisplay] = useState<number>(0);
  const [dayPauseToDisplay, setDayPauseToDisplay] = useState<number>(0);
  const [dayStopsToDisplay, setDayStopsToDisplay] = useState<number>(0);

  useEffect(() => {
    let minArray: Date[] = globalStorage.map(
      (session) => new Date(session.sessionTimeStamp)
    );

    if (minArray.length === 0) {
      minArray = [new Date()];
    }

    const globalStorageWeeksArray = eachWeekOfInterval(
      {
        start: min(minArray),
        end: max(minArray),
      },
      { weekStartsOn: 1 }
    );

    let statisticArray: any = [];
    let dayStatistic: object;
    for (let i = 0; i < globalStorageWeeksArray.length; i++) {
      for (let numOfDayWeek = 0; numOfDayWeek < 7; numOfDayWeek++) {
        let weekDay: string = "";
        switch (numOfDayWeek) {
          case 0:
            weekDay = "Понедельник";
            break;
          case 1:
            weekDay = "Вторник";
            break;
          case 2:
            weekDay = "Среда";
            break;
          case 3:
            weekDay = "Четверг";
            break;
          case 4:
            weekDay = "Пятница";
            break;
          case 5:
            weekDay = "Суббота";
            break;
          case 6:
            weekDay = "Воскресенье";
            break;
        }
        dayStatistic = {
          weekOfTheSession: globalStorageWeeksArray[i],
          weekDay: weekDay,
          sessionDay: new Date(
            add(globalStorageWeeksArray[i], {
              days: numOfDayWeek,
            })
          ),
        };
        statisticArray.push(dayStatistic);
      }
    }
    globalStorage.map((sessionGlobal) => {
      statisticArray = statisticArray.map((session: ICurDate) => {
        if (
          session.sessionDay?.toDateString() ===
          new Date(sessionGlobal.sessionTimeStamp).toDateString()
        ) {
          return {
            ...session,
            totalTomatoes: sessionGlobal.totalTomatoes,
            totalAppActiveTime: sessionGlobal.sessionDuration,
            totalWorkTime: sessionGlobal.timeOnWork,
            totalPause: sessionGlobal.timeOnPause,
            totalStops: sessionGlobal.totalStops,
          };
        }
        return session;
      });
      return sessionGlobal;
    });
    let temporaryArray: Array<object> = [];
    for (let i = 0; i < statisticArray.length; i++) {
      if (
        (statisticArray[i + 1] &&
          statisticArray[i].weekOfTheSession !==
            statisticArray[i + 1].weekOfTheSession) ||
        (!statisticArray[i + 1] && statisticArray[i] !== statisticArray[i - 1])
      ) {
        let notEmptyWeek = false;
        let currentWeekSession: Date | undefined =
          statisticArray[i].weekOfTheSession;
        for (let t = i; t > i - 7; t--) {
          if (statisticArray[t].totalAppActiveTime >= 0) {
            notEmptyWeek = true;
            currentWeekSession = statisticArray[i].weekOfTheSession;
          }
        }
        if (notEmptyWeek) {
          temporaryArray = temporaryArray.concat(
            statisticArray.filter(
              (session: ICurDate) =>
                session.weekOfTheSession === currentWeekSession
            )
          );
        }
      }
    }
    setArrayToDisplayStatistics(temporaryArray);
  }, [globalStorage]);

  useEffect(() => {
    let temporaryArray: Array<{ value?: Date; label?: string }> = [];
    for (let i = 0; i < arrayToDisplayStatistics.length; i++) {
      if (
        (arrayToDisplayStatistics[i + 1] &&
          arrayToDisplayStatistics[i].weekOfTheSession !==
            arrayToDisplayStatistics[i + 1].weekOfTheSession) ||
        (!arrayToDisplayStatistics[i + 1] &&
          arrayToDisplayStatistics[i] !== arrayToDisplayStatistics[i - 1])
      ) {
        temporaryArray.push({
          value: arrayToDisplayStatistics[i].weekOfTheSession,
          label: arrayToDisplayStatistics[i].weekOfTheSession?.toString(),
        });
      }
    }
    setWeekListOptions(temporaryArray);
    setDefaultWeek(temporaryArray.length - 1);
  }, [arrayToDisplayStatistics]);

  useEffect(() => {
    if (weekListOptions.length > 0 && initial) {
      setInitial(false);
      setChartData(
        arrayToDisplayStatistics
          .filter(
            (value) =>
              value.weekOfTheSession ===
              weekListOptions[weekListOptions.length - 1].value
          )
          .map((session) => (session.totalWorkTime ? session.totalWorkTime : 0))
      );
      setSelectedWeek(weekListOptions[weekListOptions.length - 1].value);
    }
  }, [weekListOptions]);

  const handleWeekChange = (
    event: SingleValue<{ value: Date; label: string }>
  ) => {
    setChartData(
      arrayToDisplayStatistics
        .filter((value) => value.weekOfTheSession === event?.value)
        .map((session) => (session.totalWorkTime ? session.totalWorkTime : 0))
    );
    setSelectedWeek(event?.value);
  };
  const [colors, setColors] = useState<Array<string>>([]);
  useEffect(() => {
    //Обновляем цвета для графика
    let tempArray: Array<string> = [];
    let index: number = 0;
    for (let i of chartData) {
      if (i === 0) tempArray.push("#C4C4C4");
      else tempArray.push("#EA8A89");
    }

    switch (dayOfWeekToDisplay) {
      case "Понедельник":
        index = 0;
        break;
      case "Вторник":
        index = 1;
        break;
      case "Среда":
        index = 2;
        break;
      case "Четверг":
        index = 3;
        break;
      case "Пятница":
        index = 4;
        break;
      case "Суббота":
        index = 5;
        break;
      case "Воскресенье":
        index = 6;
        break;
    }
    if (chartData[index] !== 0) tempArray[index] = "#DC3E22";
    setColors(tempArray);
  }, [chartData, dayOfWeekToDisplay]);

  const data = {
    labels: [
      "Понедельник",
      `Вторник`,
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ],
    datasets: [
      {
        type: "bar" as const,
        backgroundColor: colors,
        data: chartData,
        borderWidth: 0,
        minBarLength: 20,
      },
    ],
  };

  useEffect(() => {
    setDayDataToDisplay(
      arrayToDisplayStatistics.filter(
        (day) =>
          day.weekOfTheSession?.toDateString() ===
            selectedWeek?.toDateString() &&
          day.weekDay?.toString() === selectedWeekDay.toString()
      )
    );
  }, [selectedWeekDay, selectedWeek]);

  useEffect(() => {
    if (dayDataToDisplay[0]) {
      setDayOfWeekToDisplay(
        dayDataToDisplay[0].weekDay
          ? dayDataToDisplay[0].weekDay
          : "Понедельник"
      );
      setDayWorkTimeToDisplay(
        dayDataToDisplay[0].totalWorkTime
          ? dayDataToDisplay[0].totalWorkTime
          : 0
      );
      setDayTomatoesToDisplay(
        dayDataToDisplay[0].totalTomatoes
          ? dayDataToDisplay[0].totalTomatoes
          : 0
      );
      setDayFocusToDisplay(
        dayDataToDisplay[0].totalAppActiveTime &&
          dayDataToDisplay[0].totalWorkTime
          ? (dayDataToDisplay[0].totalWorkTime /
              60 /
              dayDataToDisplay[0].totalAppActiveTime) *
              100
          : 0
      );
      setDayPauseToDisplay(
        dayDataToDisplay[0].totalPause ? dayDataToDisplay[0].totalPause : 0
      );
      setDayStopsToDisplay(
        dayDataToDisplay[0].totalStops ? dayDataToDisplay[0].totalStops : 0
      );
    }
  }, [dayDataToDisplay]);

  useEffect(() => {
    setSelectedWeekDay("Понедельник");
  }, [selectedWeek]);

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.weekChooser}>
          <p className={styles.statsHeader__text}>Ваша активность</p>
          <WeekChooser
            weeksArray={weekListOptions}
            handleWeekChange={handleWeekChange}
            defaultWeek={defaultWeek}
          />
        </div>
        <div className={styles.activityContainer}>
          <div className={styles.activityContainer__widgets}>
            <DayWorkTotal
              weekDay={dayOfWeekToDisplay}
              totalWorkTime={dayWorkTimeToDisplay}
            />
            <DayTomatoesTotal totalTomatoes={dayTomatoesToDisplay} />
          </div>
          <div className={styles.activityContainer__barChart}>
            <BarChart
              data={data}
              setSelectedWeekDay={setSelectedWeekDay}
              selectedWeek={selectedWeek}
            />
          </div>
        </div>
        <div className={styles.bottom__widgets}>
          <DayFocusTotal totalFocus={dayFocusToDisplay} />
          <DayPauseTotal totalPause={dayPauseToDisplay} />
          <DayStopsTotal totalStops={dayStopsToDisplay} />
        </div>
      </div>
    </div>
  );
}
