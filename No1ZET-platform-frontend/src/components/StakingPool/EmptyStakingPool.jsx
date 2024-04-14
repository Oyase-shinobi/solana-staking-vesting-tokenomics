import React from "react";
import Button from "../Button"

const EmptyStakingPool = ({ setIsCreate }) => {
  return (
    <div className="w-1/3 flex flex-col items-center gap-8 ">
      <img src="/images/stakepool.png" className="h-72 object-contain" alt="" />
      <p className="dark:text-white text-title-light font-semibold text-3xl text-center">
        Welcome to your new
        <span className="text-[#FB9037]"> staking management panel</span>
      </p>
      <p className="dark:text-subtitle-dark text-subtitle-light text-sm font-light">
        Let’s get started by creating your first staking pool
      </p>
      <Button text="Create" onClick={() => setIsCreate(true)} />
    </div>
  );
};

export default EmptyStakingPool;
