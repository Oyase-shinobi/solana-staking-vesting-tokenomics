import React, { useState } from "react";

import clsx from "clsx";

import NFTStakingSection from "../../components/Staking/NFTStakingSection";
import NFTVestingSection from "../../components/Staking/NFTVestingSection";
import TokenStakingSection from "../../components/Staking/TokenStakingSection";
import TokenVestingSection from "../../components/Staking/TokenVestingSection";

const StakingPage = () => {
  const [stakingType, setStakingType] = useState("Staking");

  const onTabSelected = (type) => {
    setStakingType(type);
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-col w-11/12 gap-4 ">
        <div className="pl-4 bg-white rounded-xl dark:bg-lightBrown shadow-custom">
          <div className="flex flex-row items-center justify-between py-3 ">
            <div className="flex flex-col items-start justify-start gap-2 py-2">
              <h1 className="font-semibold md:text-xl lg:text-2xl">
                <span className="dark:text-white text-title-light">{`Earn passive income with `}</span>
                <span className="text-[#FB9037]">staking</span>
              </h1>
              <div className="text-[#FB9037] text-base cursor-pointer font-light">
                Stake Now!
              </div>
            </div>
            <img
              className="hidden h-full dark:lg:flex"
              alt=""
              src="/icons/stakenow.svg"
            />
            <img
              className="hidden h-full dark:hidden lg:flex "
              alt=""
              src="/icons/stakenow-light.svg"
            />
          </div>
        </div>

        <div className="flex flex-row items-center justify-start h-16 gap-6 px-3 text-lg bg-white rounded-xl dark:bg-lightBrown md:h-20 dark:text-white text-title-light shadow-custom">
          <div
            className={clsx(
              "h-full flex flex-col justify-center cursor-pointer",
              stakingType === "Staking" ? "border-b-2 border-[#FB9037]" : ""
            )}
          >
            <div
              className="text-sm capitalize sm:text-base md:text-base lg:text-xl whitespace-nowrap"
              onClick={() => onTabSelected("Staking")}
            >
              token staking
            </div>
          </div>
          <div
            className={clsx(
              "h-full flex flex-col justify-center cursor-pointer",
              stakingType === "NFTStaking" ? " border-b-2 border-[#FB9037]" : ""
            )}
          >
            <div
              className="text-sm capitalize sm:text-base md:text-base lg:text-xl whitespace-nowrap"
              onClick={() => onTabSelected("NFTStaking")}
            >
              NFT Staking
            </div>
          </div>
        </div>
        {stakingType === "Staking" && <TokenStakingSection />}
        {stakingType === "NFTStaking" && <NFTStakingSection />}
      </div>
    </div>
  );
};

export default StakingPage;
