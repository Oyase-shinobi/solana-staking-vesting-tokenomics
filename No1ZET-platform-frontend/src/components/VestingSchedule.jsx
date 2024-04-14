import React, { useState } from "react";

const VestingSchedule = () => {
  const events = [
    {
      date: "Contract in Place ",
      title: <>April 7, 2024.<br/>The contract is established  <br/>and in effect as of this date.</>,
      completed: true,
    },
    {
      date: "3 Months Cliff Period",
      title: <> April 7, 2024 - July 7, 2024.<br/>The cliff period commences  <br/>on April 7, 2024, and extends  <br/>until July 7, 2024. </>,
      completed: true,
    },
    {
      date: "",
      title: <><br/> During this period, <br/> No Staking / Vesting occurs.</>,
      completed: true,
    },
    {
      date: "Staking / Vesting Begin",
      title: <>July 8, 2024<br/>Following the conclusion of <br/>the cliff period, the vesting<br/> process begins. </>,
      completed: true,
    },
    {
      date: "",
      title: <><br/>Starting from July 8, 2024, <br/>the vesting will occur at <br/>a rate of 3% per month.</>,
      completed: true,
    },
    {
      date: "July 8, 2024",
      title: "New Token will be Launched ",
      completed: true,
    },
    // {
    //   date: "December 29, 2023",
    //   title: "Cliff started",
    //   completed: true,
    // },
    // {
    //   date: "December 29, 2023",
    //   title: "Cliff started",
    //   completed: true,
    // },
    // {
    //   date: "December 29, 2023",
    //   title: "Vesting begins",
    //   completed: false,
    // },
    // ... other events
  ];

  const [showAll, setShowAll] = useState(false);
  const eventsToShow = showAll ? events : events.slice(0, 5);
  const hasMore = events.length > 5;

  return (
    <div className="w-full h-full rounded-xl  dark:bg-lightBrown bg-white shadow-custom ">
      <div className=" flex flex-row items-center justify-start gap-2">
        <div className=" dark:text-white text-title-light  p-4 rounded-lg max-w-sm">
          <div className="flex justify-start gap-3  mb-4">
            <h2 className=" text-lg font-semibold">Staking / Vesting Schedule</h2>
            <img src="icons/info.svg" alt="" />
          </div>
          <ul className="">
            {eventsToShow.map((event, index) => (
              <li key={index} className="relative">
                <div
                  className={`w-3 h-3 rounded-full ${
                    event.completed
                      ? "bg-[#BE854B] shadow-[0px_0px_5.8px_rgba(197,_118,_37,_0.5)] "
                      : "border-[#ababab] border-2"
                  }`}
                ></div>
                <div className="absolute top-0 left-8 h-16 flex flex-col w-full ">
                  <time className="text-base font-semibold my-1">
                    {event.date}
                  </time>
                  <h3 className="text-sm italic mx-1 hover:not-italic dark:text-subtitle-dark text-subtitle-light font-normal leading-none">{event.title}</h3>
                </div>

                {index !== eventsToShow.length - 1 && (
                  <div
                    className={`h-12 my-2 border-l-2 ml-1.5 border-[#BE854B] ${
                      eventsToShow[index + 1].completed
                        ? "border-[#BE854B]"
                        : "border-[#ababab]"
                    }`}
                  ></div>
                )}
              </li>
            ))}

            {hasMore && showAll && (
              <button
                onClick={() => setShowAll(false)}
                className="mt-12  flex flex-col w-full text-sm text-[#FB9037] "
              >
                SHOW LESS
              </button>
            )}
            {hasMore && !showAll && (
              <>
                <div
                  className={`h-12 my-1 border-l-2 ml-1.5 border-[#BE854B]`}
                ></div>
                <li className="relative">
                  <div
                    className={`w-3 h-3 rounded-full border-2 border-[#FB9037] shadow-[0px_0px_5.8px_rgba(197,_118,_37,_0.5)] 
                  `}
                  ></div>
                  <button
                    onClick={() => setShowAll(true)}
                    className="absolute top-0 left-8 h-16 flex flex-col w-full text-sm text-[#FB9037] "
                  >
                    SHOW MORE
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VestingSchedule;
