import { Link, useLocation } from "react-router-dom";

const TabLink = () => {
  const { pathname } = useLocation();
  return (
    <div className="max-w-xl mx-auto bg-primary p-1 rounded-full">
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <Link
            to="/claim"
            className={`${
              pathname === "/claim" ? "bg-tabgrad" : "bg-none"
            } flex items-center justify-center space-x-2 md:space-x-4 py-1 sm:py-[6px] rounded-full`}
          >
            <div>
              <svg
                width="32"
                height="32"
                viewBox="0 0 39 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8"
              >
                <g opacity={pathname === "/claim" ? "1" : "0.5"}>
                  <circle cx="19.5" cy="19.5" r="19.5" fill="white" />
                  <path
                    d="M25.136 22.3337L26.923 18.457C26.8956 17.8247 26.5381 17.4673 25.8783 17.4398H11.6366C10.9492 17.4673 10.4818 17.7697 10.1794 18.4021L8.66723 21.7013L8.63974 21.7288L5.42298 28.4647C5.12055 29.1246 5.313 29.482 5.97285 29.482H10.0969C10.7842 29.4545 11.3066 29.1246 11.6366 28.4647L14.0835 23.2959H23.6513C24.3661 23.2684 24.861 22.966 25.136 22.3337ZM33.494 10.7313C33.4665 10.0715 33.1091 9.74154 32.4493 9.71405H14.8258C14.166 9.74154 13.6711 10.044 13.3687 10.6763L11.5816 14.5529C11.6091 15.2128 11.9665 15.5427 12.6263 15.5702H30.2498C30.9096 15.5427 31.4045 15.2403 31.6795 14.6079L33.494 10.7313Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </div>
            <span
              className={`${pathname === "/claim" ? "text-white" : "text-white/50"} text-xl sm:text-2xl md:text-3xl`}
            >
              Claim Airdrop
            </span>
          </Link>
        </div>
        <div className="col-span-1">
          <Link
            to="/"
            className={`${
              pathname === "/" ? "bg-tabgrad" : "bg-none"
            } flex items-center justify-center space-x-2 md:space-x-4 py-1 sm:py-[6px] rounded-full`}
          >
            <div>
              <svg
                width="39"
                height="30"
                viewBox="0 0 43 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${pathname === "/" ? "opacity-100" : "opacity-25"} h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8`}
              >
                <path
                  d="M7.6726 12.7572C9.58634 15.4321 6.54697 15.3702 4.95218 15.7417C-1.77306 17.3084 2.13733 26.3307 14.4663 28.1883C26.7952 30.0459 36.3344 24.7156 39.6466 18.3998C42.9589 12.084 42.843 0.83964 24.7998 1.00173C4.19022 1.18688 5.28041 9.41348 7.6726 12.7572Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M14.3688 33.3308C27.2685 35.316 37.2493 29.6196 40.7148 22.8699C41.6165 21.1139 41.8511 17.2879 42 15.1262C39.2437 20.4666 34.748 24.1365 30.1555 26.3221C25.563 28.5077 21.9228 29.303 12.3119 27.9028C3.58403 26.6313 1.3395 21.0943 1.00326 17.8733V23.5273C0.858101 27.0486 5.55955 31.9751 14.3688 33.3308Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.36107 17.0238C10.5919 16.7361 12.6842 15.6427 11.2073 13.5711C9.36107 10.9815 7.23084 3.21284 23.1366 3.06897C39.0423 2.92511 40.0364 11.2692 37.4801 16.1606C34.9238 21.052 26.829 27.382 17.3139 25.9434C7.7989 24.5047 -0.0119472 18.7502 9.36107 17.0238ZM24.0448 5.83003C23.1261 5.7726 21.4952 6.0712 22.3221 7.72498C22.7115 8.50377 23.3943 9.11141 24.0296 9.67685C25.0807 10.6123 26.0021 11.4323 25.2506 12.7208C24.0448 14.788 21.4606 15.9939 19.738 15.8216C18.0153 15.6493 18.3598 17.7166 19.738 18.0611C20.3421 18.2121 21.5421 17.1715 22.8445 16.0419C24.5133 14.5947 26.3504 13.0016 27.3179 13.5821C29.0406 14.6157 31.9692 15.8216 32.6583 15.1325C33.3473 14.4435 33.8641 12.7208 31.6246 12.7208C31.2113 12.7208 30.8508 12.7384 30.529 12.7541C29.1073 12.8235 28.4417 12.856 27.3179 11.1703C26.7958 10.3871 26.4467 9.52973 26.1209 8.72931C25.5867 7.41711 25.1148 6.25804 24.0448 5.83003Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className={`${pathname === "/" ? "text-white" : "text-white/50"} text-xl sm:text-2xl md:text-3xl`}>
              Stake $FRENS
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TabLink;
