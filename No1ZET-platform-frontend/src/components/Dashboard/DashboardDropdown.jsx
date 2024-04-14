import React from "react";

const DashboardDropdown = () => {
  return (
    <div className="w-full dark:text-white text-title-light">
      <select
        name="staked"
        id="staked"
        className="w-full h-10  dark:bg-lightBrown border-2 dark:border-[#593D2B] rounded px-1 text-sm"
      >
        <option selected value="Option 1">
          Staked
        </option>
        <option value="Option 2">Option 2</option>
      </select>
    </div>
  );
};

export default DashboardDropdown;
