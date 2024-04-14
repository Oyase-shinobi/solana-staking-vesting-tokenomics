import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { CiDark, CiLight } from "react-icons/ci";
import { useTheme } from "./ThemeProvider";

const ThemeToggleBtn = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="">
      <Switch
        checked={isDarkMode}
        onChange={() => toggleTheme()}
        className={`${
          isDarkMode
            ? " bg-[#CD8143]/10 border-none"
            : "bg-[#CD8143]/10 text-[#CD8143] border-[0.5px]"
        } relative inline-flex items-center py-0.5 w-14  border-solid aspect-[2] rounded-full  shadow-sm transition-colors duration-200 ease-in-out `}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${
            !isDarkMode ? "translate-x-7" : "translate-x-1"
          }  size-6 flex items-center justify-center transform bg-secondary-dark-bg/80 dark:bg-secondary-dark-bg/50 rounded-full transition shadow-lg duration-200 ease-in-out`}
        >
          {!isDarkMode ? (
            <CiDark className="text-white size-5 " />
          ) : (
            <CiLight className="text-white size-5  " />
          )}
        </span>
      </Switch>
    </div>
  );
};

export default ThemeToggleBtn;
