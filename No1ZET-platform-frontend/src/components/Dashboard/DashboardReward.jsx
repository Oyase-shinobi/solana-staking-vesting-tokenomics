import React from "react";
import Button from "../Button";

const DashboardReward = () => {
  return (
    <div className=" w-full rounded-xl dark:bg-lightBrown bg-white overflow-hidden p-4 shadow-custom">
      <div className="flex flex-col items-center gap-14 ">
        <div className="flex flex-col items-center justify-start gap-2">
          <img className="w-12 hidden dark:flex" alt="" src="/icons/logo1.svg" />
          <img className="w-12 dark:hidden flex" alt="" src="/icons/logo1-light.svg" />
          <div className="text-lg font-semibold dark:text-white text-title-light">
            My Rewards
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-xs dark:text-subtitle-dark text-subtitle-light">
            Unclaimed Rewards
          </div>
          <div className="flex flex-row items-center justify-start text-lg text-darkorange">
            <div className=" font-semibold text-[#FB9037]">200 SOL</div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-2">
          <div className="dark:text-subtitle-dark text-subtitle-light text-xs">
            Total claimed Rewards:1000 SOL
          </div>
          <div className="bg-darkorange" />
          <div className="w-full h-11  text-base rounded-lg font-semibold">
            <Button text="Claim Rewards" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReward;
