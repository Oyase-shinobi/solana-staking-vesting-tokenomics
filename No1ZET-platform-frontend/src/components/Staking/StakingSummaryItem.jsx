import React from "react";

const StakingSummaryItem = ({ icon, value, title, info }) => {
  return (
    <div className="w-full flex flex-row ">
      <div className="flex flex-row  gap-2">
        <img className="h-10" alt="" src={icon} />
        <div className="flex flex-col items-end justify-start ">
          <div className="flex flex-row items-center justify-start">
            <div className="text-xs dark:text-subtitle-dark text-subtitle-light">
              {title}
            </div>
            {info && <img className="w-3 h-3" alt="" src="/icons/info.svg" />}
          </div>
          <div className="flex flex-row items-center justify-start text-lg dark:text-white text-title-light">
            <div className=" font-semibold">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingSummaryItem;
