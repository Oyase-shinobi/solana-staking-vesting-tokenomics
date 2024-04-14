import React from "react";

const VestingStatItem = ({ icon, value, title }) => {
  return (
    <div className="w-full flex flex-row items-center pl-4 rounded-xl bg-[#3b2619]  h-36 ">
      <div className="flex flex-row items-start justify-start gap-2">
        <img className="h-10" alt="" src={icon} />
        <div className="flex flex-row items-start justify-start">
          <div className="flex flex-col items-start justify-start ">
            <div className="flex flex-row items-center justify-start gap-1">
              <div className="text-xs text-gray-400">{title}</div>
              <img className="w-4 h-4" alt="" src="/icons/info.svg" />
            </div>
            <div className="flex flex-row items-center justify-start text-lg text-white">
              <div className=" font-semibold">{value}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VestingStatItem;
