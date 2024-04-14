import React from "react";

const StatItem = ({ iconDark, iconLight, value, title, info }) => {
  return (
    <div className=" flex flex-row items-center pl-4 rounded-xl dark:bg-lightBrown bg-white h-32 shadow-custom">
      <div className="flex flex-row items-start justify-start gap-2">
        <img className="h-10 hidden dark:flex" alt="" src={iconDark} />
        <img className="h-10 dark:hidden flex" alt="" src={iconLight} />
        <div className="flex flex-col items-start justify-start ">
          <div className="flex flex-row items-center justify-start">
            <div className="text-xs dark:text-subtitle-dark text-subtitle-light">
              {title}
            </div>
            {info && <img className="w-3 h-3" alt="" src="/icons/info.svg" />}
          </div>
          <div className="flex flex-row items-center justify-start text-lg dark:text-white text-title-light ">
            <div className=" font-semibold">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatItem;
