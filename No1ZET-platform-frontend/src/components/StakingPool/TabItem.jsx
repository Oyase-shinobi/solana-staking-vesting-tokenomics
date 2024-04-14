import React from "react";
const TabItem = ({ selectedForm, setSelectedForm, name, value }) => {
  return (
    <div
      className={`
                  flex items-center justify-center cursor-pointer w-1/2 h-full rounded-lg
                  ${
                    selectedForm === value
                      ? "dark:bg-[#342216] bg-[#AA6C39] text-white"
                      : "bg-transparent dark:text-[#ababab] text-[#E1E1E1]"
                  }
                `}
      onClick={() => setSelectedForm(value)}
    >
      {name}
    </div>
  );
};
export default TabItem;
