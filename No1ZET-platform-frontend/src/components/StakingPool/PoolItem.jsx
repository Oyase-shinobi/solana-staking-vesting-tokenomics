import React from "react";
import Button from "../Button";
const PoolItem = ({ pool }) => {
  return (
    <div className="w-56 sm:w-64 2xl:w-72 rounded-xl dark:bg-lightBrown bg-[#FFE5CF] h-80 border-[0.5px] border-solid border-[#80573D] dark:text-white text-title-light py-6">
      <div className=" flex flex-col items-center justify-start gap-3">
        <div className="flex flex-col items-center justify-start gap-3">
          <div className="font-semibold">{pool.type}</div>
          <img className="w-28 h-28" alt="" src="/icons/logo1.svg" />
          <div className="flex flex-col items-center justify-start gap-1 text-sm">
            <div className="">{pool.name}</div>
            <div className=" dark:text-subtitle-dark text-subtitle-light">{`${pool.lock} Days Lock`}</div>
            <div className="">{`APY ${pool.apy} %`}</div>
          </div>
        </div>
        <div className="w-full h-11 px-6">
          <Button text="Select" />
        </div>
      </div>
    </div>
  );
};

export default PoolItem;
