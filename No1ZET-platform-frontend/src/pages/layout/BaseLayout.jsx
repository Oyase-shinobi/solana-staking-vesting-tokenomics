import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import SliderBar from "../../components/SliderBar";
// import ASCIIArt from "../../components/birds";

const BaseLayout = () => {
  return (
    <>
      <div className="flex min-h-screen justify-between">
        <div className="fixed inset-y-0 left-0 w-1/5 overflow-y-auto hidden lg:flex">
          <SliderBar />
        </div>
        <div className=" w-1/5 hidden lg:flex" />
        <div className="w-full lg:w-4/5 min-h-screen flex flex-col bg-primary-bg dark:bg-primary-dark-bg">
          <Header />
          <div className="h-[1px] dark:bg-[#3A2619] bg-[#ECECEC]"></div>
          <main className="z-10 h-full py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default BaseLayout;
