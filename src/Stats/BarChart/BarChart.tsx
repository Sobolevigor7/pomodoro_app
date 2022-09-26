import styles from "./barchart.module.css";
import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ChartData, InteractionItem, ChartOptions } from "chart.js";

import { Chart, getElementAtEvent } from "react-chartjs-2";

import { WORK_PERIOD } from "../../Main";

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  //Tooltip, Тултипы отключены - не было в ТЗ
} from "chart.js";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  BarController
);

interface Props {
  data: ChartData;
  setSelectedWeekDay: Dispatch<SetStateAction<string>>;
  selectedWeek: Date | undefined;
}

export function BarChart({ data, setSelectedWeekDay, selectedWeek }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [colors, setColors] = useState<Array<string>>(["green"]);

  useEffect(() => {
    //При смене рабочей недели сбрасываем указатель выбранного дня на понедельник
    setSelectedIndex(0);
  }, [selectedWeek]);
  useEffect(() => {
    //Меняем цвет выбранного дня недели
    let tempArray: Array<string> = [];
    for (let i = 0; i < 7; i++) {
      if (i === selectedIndex) tempArray.push("#DC3E22");
      else tempArray.push("#999999");
    }
    setColors(tempArray);
  }, [selectedIndex, selectedWeek]);

  const options: ChartOptions = {
    //Опции графика
    onHover: (event, chartElement) => {
      // @ts-ignore
      event.native.target.style.cursor = chartElement[0] ? "pointer" : "";
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: colors,
        },
      },

      y: {
        position: "right",
        min: 0,
        bounds: "data",
        grid: {
          drawTicks: false,
        },

        ticks: {
          maxTicksLimit: 6,
          padding: 10,
          labelOffset: 3,
          showLabelBackdrop: false,
          color: "#333333",
          callback: function (value, index, ticks) {
            /* let res: string = "";
            if (Number(value) === 0) {
              res = "";
            } else if (Math.trunc(Number(value) / 60) > 60) {
              res =
                Math.trunc(Math.floor(Number(value) / 60 / 60)) +
                " ч " +
                ((Math.round(Number(value) / 60 / (WORK_PERIOD / 60)) *
                  (WORK_PERIOD / 60)) %
                  60) +
                " мин";
            } else {
              res =
                Math.round(Number(value) / 60 / (WORK_PERIOD / 60)) *
                  (WORK_PERIOD / 60) +
                " мин";
            }*/
            let res: string = "";
            if (Number(value) === 0) {
              res = "";
            } else if (Math.trunc(Number(value) / 60) > 60) {
              res =
                Math.trunc(Math.floor(Number(value) / 60 / 60)) +
                " ч " +
                (Math.round(Number(value) / 60) % 60) +
                " мин";
            } else {
              res = Math.round(Number(value) / 60) + " мин";
            }

            return res;
          },
        },
      },
    },
  };

  const selectElementAtEvent = (element: InteractionItem[]) => {
    if (!element.length) return;
    const { index } = element[0];

    // @ts-ignore
    setSelectedWeekDay(data.labels[index]);

    setSelectedIndex(element[0].index);
  };

  const chartRef = useRef<ChartJS>(null);

  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
    //Отрабатываем клик на баре для определения выбранного отображаемого дня
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }
    selectElementAtEvent(getElementAtEvent(chart, event));
  };

  return (
    <>
      <Chart
        ref={chartRef}
        type="bar"
        onClick={onClick}
        options={options}
        data={data}
        className={styles.widget__container}
      />
    </>
  );
}
