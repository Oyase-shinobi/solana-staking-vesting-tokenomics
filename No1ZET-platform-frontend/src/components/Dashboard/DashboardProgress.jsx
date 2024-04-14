import React from "react";
import { useState } from "react";
const DashboardProgress = () => {
  const [vested, setVested] = useState(64);
  const [released, setReleased] = useState(20);
  return (
    <div className="flex flex-col items-start justify-start p-6 gap-4 ">
      <div className="w-full flex flex-row items-start justify-between">
        <div className="flex flex-col items-start justify-start gap-2">
          <div className="flex flex-row items-center justify-start gap-1">
            <div className="text-xs dark:text-subtitle-dark text-subtitle-light ">
              VESTED SO FAR
            </div>
            <img className="w-3 h-3" alt="" src="/icons/info.svg" />
          </div>
          <div className="flex flex-row items-center justify-start gap-3 text-lg text-white">
            <div className="w-full  dark:text-white text-title-light font-semibold inline-block h-5 shrink-0">
              154,189 N01zet
            </div>
            <div className="rounded bg-amber-800 flex flex-row items-center justify-center text-xs px-1 py-0.5">
              <div className="font-semibold ">{vested}%</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-start gap-[4px_0px]">
          <div className="flex flex-row items-center justify-start gap-1">
            <div className="text-xs dark:text-subtitle-dark text-subtitle-light ">
              TOTAL VESTING
            </div>
            <img className="w-3 h-3" alt="" src="/icons/info.svg" />
          </div>
          <div className="flex flex-row items-center justify-start text-lg text-white">
            <div className="w-full  dark:text-white text-title-light font-semibold inline-block h-5 shrink-0">
              240,000 N01zet
            </div>
          </div>
        </div>
      </div>
      <div className="w-full relative rounded-xl dark:bg-white/80 bg-[#DADCE5] h-2 ">
        <div
          className="absolute h-full rounded-xl bg-amber-800"
          style={{ width: `${vested}%` }}
        />
        <div
          className="absolute h-full rounded-xl bg-amber-600"
          style={{ width: `${released}%` }}
        />
      </div>
      <div className="flex flex-row items-center justify-start gap-4 text-smi dark:text-white text-title-light ">
        <div className="flex gap-2 items-baseline">
          <span className="font-semibold">{`130,557 N01zet`}</span>
          <span className="font-light text-xs">released</span>
        </div>
        <div className="rounded bg-amber-600 flex flex-row items-center justify-center text-xs px-1 py-0.5">
          <div className=" font-semibold text-white">{released}%</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProgress;
