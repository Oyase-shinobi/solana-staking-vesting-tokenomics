import React from "react";
import PoolItem from "../../components/StakingPool/PoolItem";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Button from "../../components/Button";
import { useTheme } from "../ThemeProvider";

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  const { isDarkMode } = useTheme();
  return (
    <img
      src={`/icons/left-chevron${isDarkMode ? "" : "-light"}.svg`}
      className={className}
      style={{
        ...style,
        display: "block",
        borderWidth: "2px",
        borderRadius: "2px",
        borderStyle: "solid",
        padding: "8px",
        color: "white",
        borderColor: "#89785E",
        height: "30px",
        width: "30px",
        zIndex: 20,
        marginLeft: "-10px",
      }}
      onClick={onClick}
    />
  );
};

const NextArrow = (props) => {
  const { isDarkMode } = useTheme();
  const { className, style, onClick } = props;
  return (
    <img
      src={`/icons/right-chevron${isDarkMode ? "" : "-light"}.svg`}
      className={className}
      style={{
        ...style,
        display: "block",
        borderWidth: "2px",
        borderRadius: "2px",
        borderStyle: "solid",
        padding: "8px",
        color: "white",
        borderColor: "#89785E",
        height: "30px",
        width: "30px",
        zIndex: 20,
        marginRight: "-10px",
      }}
      onClick={onClick}
    />
  );
};

const StakingPools = ({ stakingPools, setIsCreate }) => {
  const settings = {
    dots: false,
    slidesToScroll: 1,
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    leftMode: true,
    speed: 500,
    slidesToShow: 4,
    rows: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          centerPadding: "50px",
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          centerPadding: "60px",
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-8 py-10">
        <img
          src="/images/stakepool.png"
          className="h-52 md:h-64 lg:h-72 object-contain"
          alt=""
        />
      </div>
      <div className="flex justify-between mb-8">
        <p className="dark:text-white text-title-light font-semibold text-xl">
          Active Pools
        </p>
        <div className="w-36 h-10 ">
          <Button
            text="Create Pool"
            onClick={() => setIsCreate(true)}
            iconSrc="/icons/add.svg"
          />
        </div>
      </div>
      <div className="w-full relative">
        <Slider className="w-full" {...settings}>
          {stakingPools.map((pool) => (
            <PoolItem key={pool.id} pool={pool} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default StakingPools;
