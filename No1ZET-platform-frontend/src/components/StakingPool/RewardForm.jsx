import React from "react";
import TextField from "../TextField";
import Button from "../Button";

const RewardForm = ({ setIsCreate }) => {
  const poolEndDateRef = React.useRef(null);

  return (
    <div className="w-full flex flex-col items-center ">
      <div className="w-full flex flex-col gap-5 p-6">
        <TextField
          label="Overlay text"
          placeholder="STAKED nFT"
          type="text"
          id="STAKED nFT"
          name="STAKED nFT"
          onChange={() => {}}
        />

        <div className="form-group  ">
          <div className="flex gap-1">
            <p className="dark:text-white text-title-light text-sm">
              Collection Address
            </p>
            <img src="/icons/info.svg" alt="" />
          </div>
          <div className="relative">
            <input
              type="text"
              id="STAKED nFT"
              name="STAKED nFT"
              placeholder="0xe6cc....59ff6f658a"
              className="w-full h-10  dark:bg-[#473020] bg-[#DEAB81] text-white/80 placeholder:text-white/80 rounded px-3 accent-white text-white "
              onChange={() => {}}
            />
            <button className="absolute text-sm right-2 top-1/2 -translate-y-1/2 text-[#CD8143] ">
              Add
            </button>
          </div>
        </div>
        <div className="form-group  ">
          <div className="flex gap-1">
            <p className="dark:text-white text-title-light text-sm">
              STAKED nFT
            </p>
            <img src="/icons/info.svg" alt="" />
          </div>
          <div className="relative">
            <input
              type="text"
              id="STAKED nFT"
              name="STAKED nFT"
              placeholder="0xe6cc....59ff6f658a"
              className="w-full h-10  dark:bg-[#473020] bg-[#DEAB81] text-white/80 placeholder:text-white/80 rounded px-3 accent-white text-white "
              onChange={() => {}}
            />
            <button className="absolute text-sm right-2 top-1/2 -translate-y-1/2 text-[#CD8143] ">
              Add
            </button>
          </div>
        </div>
        <TextField
          label="Cooldown period seconds"
          placeholder="0"
          type="text"
          id="STAKED nFT"
          name="STAKED nFT"
          onChange={() => {}}
        />
        <TextField
          label="Minimum Stake Seconds"
          placeholder="0"
          type="text"
          id="STAKED nFT"
          name="STAKED nFT"
          onChange={() => {}}
        />

        <div className="form-group  ">
          <div className="flex gap-1">
            <p className="dark:text-white text-title-light text-sm">
              Pool End Date
            </p>
            <img src="/icons/info.svg" alt="" />
          </div>
          <div className="relative">
            <input
              id="STAKED nFT"
              name="STAKED nFT"
              type="date"
              ref={poolEndDateRef}
              placeholder="0xe6cc....59ff6f658a"
              className="hide-date-icon w-full h-10 appearance-none ring-0  dark:bg-[#473020] bg-[#DEAB81] text-white/80 placeholder:text-white/80 rounded px-3 accent-white text-white "
              onChange={() => {}}
            />
            <button
              type="button"
              onClick={() => {
                if (poolEndDateRef.current) {
                  poolEndDateRef.current.showPicker();
                }
              }}
              className="absolute text-sm right-2 top-1/2 -translate-y-1/2 text-[#CD8143] "
            >
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white dark:text-[#AE8263]"
              >
                <path
                  d="M16.5 1.68739H14.0625V0.562387C14.0626 0.413203 14.0034 0.270089 13.898 0.164529C13.7926 0.0589699 13.6496 -0.000388692 13.5004 -0.000488148C13.3512 -0.000587604 13.2081 0.0585802 13.1025 0.163999C12.997 0.269418 12.9376 0.412453 12.9375 0.561637V1.68739H9.5625V0.562387C9.56255 0.488518 9.54805 0.415363 9.51983 0.347099C9.4916 0.278834 9.45021 0.216797 9.39801 0.164529C9.34581 0.112262 9.28383 0.0707869 9.21561 0.0424731C9.14738 0.0141593 9.07424 -0.00043891 9.00037 -0.000488156C8.85119 -0.000587612 8.70808 0.0585802 8.60252 0.163999C8.49696 0.269418 8.4376 0.412453 8.4375 0.561637V1.68739H5.0625V0.562387C5.06255 0.488518 5.04805 0.415363 5.01983 0.347099C4.9916 0.278834 4.95021 0.216797 4.89801 0.164529C4.84581 0.112262 4.78383 0.0707869 4.71561 0.0424731C4.64738 0.0141593 4.57424 -0.00043891 4.50038 -0.000488156C4.35119 -0.000587612 4.20808 0.0585802 4.10252 0.163999C3.99696 0.269418 3.9376 0.412453 3.9375 0.561637V1.68739H1.5C1.10231 1.68739 0.720888 1.84532 0.439605 2.12646C0.158322 2.4076 0.000198847 2.78894 0 3.18664V16.4991C0 16.897 0.158035 17.2785 0.43934 17.5598C0.720644 17.8411 1.10218 17.9991 1.5 17.9991H16.5C16.8978 17.9991 17.2794 17.8411 17.5607 17.5598C17.842 17.2785 18 16.897 18 16.4991V3.18664C17.9998 2.78894 17.8417 2.4076 17.5604 2.12646C17.2791 1.84532 16.8977 1.68739 16.5 1.68739ZM16.875 16.4999C16.875 16.5992 16.8356 16.6945 16.7654 16.7648C16.6953 16.8351 16.6001 16.8747 16.5007 16.8749H1.5C1.40054 16.8749 1.30516 16.8354 1.23483 16.7651C1.16451 16.6947 1.125 16.5993 1.125 16.4999V3.18739C1.1252 3.08806 1.1648 2.99287 1.2351 2.92271C1.3054 2.85254 1.40067 2.81314 1.5 2.81314H3.9375V3.93814C3.9374 4.08732 3.99657 4.23043 4.10199 4.33599C4.20741 4.44155 4.35044 4.50091 4.49962 4.50101C4.64881 4.50111 4.79192 4.44194 4.89748 4.33652C5.00304 4.23111 5.0624 4.08807 5.0625 3.93889V2.81314H8.4375V3.93814C8.4374 4.08732 8.49657 4.23043 8.60199 4.33599C8.70741 4.44155 8.85044 4.50091 8.99963 4.50101C9.14881 4.50111 9.29192 4.44194 9.39748 4.33652C9.50304 4.23111 9.5624 4.08807 9.5625 3.93889V2.81314H12.9375V3.93814C12.9374 4.08732 12.9966 4.23043 13.102 4.33599C13.2074 4.44155 13.3504 4.50091 13.4996 4.50101C13.6488 4.50111 13.7919 4.44194 13.8975 4.33652C14.003 4.23111 14.0624 4.08807 14.0625 3.93889V2.81314H16.5C16.5992 2.81334 16.6943 2.85283 16.7644 2.92297C16.8346 2.99311 16.8741 3.08819 16.8743 3.18739L16.875 16.4999Z"
                  fill="currentColor"
                />
                <path
                  d="M3.9375 6.75H6.1875V8.4375H3.9375V6.75ZM3.9375 9.5625H6.1875V11.25H3.9375V9.5625ZM3.9375 12.375H6.1875V14.0625H3.9375V12.375ZM7.875 12.375H10.125V14.0625H7.875V12.375ZM7.875 9.5625H10.125V11.25H7.875V9.5625ZM7.875 6.75H10.125V8.4375H7.875V6.75ZM11.8125 12.375H14.0625V14.0625H11.8125V12.375ZM11.8125 9.5625H14.0625V11.25H11.8125V9.5625ZM11.8125 6.75H14.0625V8.4375H11.8125V6.75Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center dark:bg-[#342216] bg-[#AA6C39] p-4 gap-3 shadow-[0px_-5px_30px_rgba(212,_132,_67,_0.25)] ">
        <div className="w-1/2 h-11">
          <Button
            text="Back"
            variant="outline"
            onClick={() => setIsCreate(false)}
          />
        </div>
        <div className="w-1/2 h-11">
          <Button text="Reward Distribution" />
        </div>
      </div>
    </div>
  );
};

export default RewardForm;
