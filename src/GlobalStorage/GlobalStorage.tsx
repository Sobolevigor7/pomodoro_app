import React, { useEffect, useState } from "react";
import connectLocalStorage from "effector-localstorage";
import { createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { useInterval } from "../hooks/useInterval";
import { WORK_PERIOD } from "../Main";

interface IGlobal {
  sessionDate: string;
  sessionTimeStamp: Date;
  sessionDuration: number;
  timeOnPause: number;
  timeOnWork: number;
  totalTomatoes: number;
  totalStops: number;
}
const globalAndLocal = connectLocalStorage("$global").onError((err) =>
  console.log("err", err)
);

const init = createEvent<Date>("init");
const updateAppWorkTime = createEvent<Date>("updateAppWorkTime");
export const updatePauseTime = createEvent<Date>("updatePauseTime");
export const updateTomatoes = createEvent<Date>("updateTomatoes");
export const resetGlobal = createEvent("resetGlobal");

export const updateTotalStops = createEvent<Date>("updateTotalStops");
export const $global = createStore<IGlobal[]>(globalAndLocal.init() || [])
  .on(init, (list, dt) => [
    ...list,
    {
      sessionDate:
        dt.getFullYear().toString() + dt.getMonth().toString() + dt.getDate(),
      sessionTimeStamp: dt,
      sessionDuration: 1,
      timeOnPause: 0,
      timeOnWork: 0,
      totalTomatoes: 0,
      totalStops: 0,
    },
  ])
  .on(updateAppWorkTime, (list, dt) =>
    list.map((record) => {
      if (
        record.sessionDate ===
        dt.getFullYear().toString() + dt.getMonth().toString() + dt.getDate()
      ) {
        return {
          ...record,
          sessionDuration: record.sessionDuration + 1,
        };
      }
      return record;
    })
  )
  .on(updatePauseTime, (list, dt) =>
    list.map((record) => {
      if (
        record.sessionDate ===
        dt.getFullYear().toString() + dt.getMonth().toString() + dt.getDate()
      ) {
        return {
          ...record,
          timeOnPause: record.timeOnPause + 1,
        };
      }
      return record;
    })
  )
  .on(updateTomatoes, (list, dt) =>
    list.map((record) => {
      if (
        record.sessionDate ===
        dt.getFullYear().toString() + dt.getMonth().toString() + dt.getDate()
      ) {
        return {
          ...record,
          totalTomatoes: record.totalTomatoes + 1,
          timeOnWork: record.timeOnWork + WORK_PERIOD,
        };
      }
      return record;
    })
  )
  .on(updateTotalStops, (list, dt) =>
    list.map((record) => {
      if (
        record.sessionDate ===
        dt.getFullYear().toString() + dt.getMonth().toString() + dt.getDate()
      ) {
        return {
          ...record,
          totalStops: record.totalStops + 1,
        };
      }
      return record;
    })
  )
  .on(resetGlobal, (list) => list.filter((state, i) => i === Infinity));

$global.watch(globalAndLocal);

export const dt = new Date();
//export const dt = new Date(2022, 8, 15);
export function GlobalStorage() {
  const globalStore = useStore($global);

  const [recordSet, setRecordSet] = useState(false);

  useEffect(() => {
    if (globalStore.length === 0) {
      init(dt);
    } else {
      let set = false;
      for (let session of globalStore) {
        if (
          session.sessionDate ===
          dt.getFullYear().toString() + dt.getMonth().toString() + dt.getDate()
        ) {
          set = true;
        }
      }
      if (!set && !recordSet) {
        //!set
        init(dt);
        set = true;
        setRecordSet(true);
      }
    }
  }, [globalStore]);

  useInterval(() => {
    updateAppWorkTime(dt);
  }, 60000);

  /*$global.watch((list) => { //Develop purposes
    // eslint-disable-next-line array-callback-return
    list.map((session) => {
      if (
        session.sessionDate ===
        dt.getFullYear().toString() + dt.getMonth().toString() + dt.getDate()
      ) {
        curSessionTime = session.sessionDuration;
        pausedTime = session.timeOnPause;
        timeWork = session.timeOnWork;
        totaltomatos = session.totalTomatoes;
        totalStops = session.totalStops;
      }
    });
  });*/

  return <></>;
}
