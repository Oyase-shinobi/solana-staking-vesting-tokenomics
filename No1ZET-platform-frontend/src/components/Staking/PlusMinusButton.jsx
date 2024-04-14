import clsx from "clsx";
import React from "react";

const PlusMinusButton = ({ value, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "w-12 h-12 flex justify-center items-center cursor-pointer dark:bg-lightBrown bg-[#FFF1E5] rounded border-2 border-[#9D8B70]",
        className
      )}
    >
      {value}
    </div>
  );
};

export default PlusMinusButton;
