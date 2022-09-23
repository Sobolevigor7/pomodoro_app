import React from "react";
import * as Icons from "./Icons";

export enum EIcons {
  menu = "DropMenuIcon",
  minusactive = "MinusActive",
  minusdisabled = "MinusDisabled",
  plus = "Plus",
  tomato2 = "Tomato2",
  tomato1 = "Tomato1",
  focus = "Focus",
  pause = "Pause",
  stop = "Stops",
  tomatosmall = "TomatoSmall",
  statsicon = "StatsIcon",
  edit = "Edit",
  delete = "Delete",
  plustime = "PlusTime",
  p404 = "P404",
}

const componentsMap = {
  Icons,
};

interface TIcons {
  icon: EIcons;
  size?: number;
  className?: string;
}

export function Icon({ icon, size = 20, className }: TIcons) {
  const IconToShow = componentsMap.Icons[icon];
  return <IconToShow size={size} className={className} />;
}
