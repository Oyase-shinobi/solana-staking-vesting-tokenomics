import clsx from "clsx";

const Button = ({
  text,
  disabled = false,
  onClick,
  variant,
  iconSrc,
  className,
}) => {
  return (
    <button
      disabled={disabled}
      className={`relative rounded-[8px]   text-white text-1xl w-full h-full 
      ${disabled ? "opacity-50" : "opacity-100"} ${
        variant === "outline"
          ? "border-2 dark:border-[#9A6440] bg-transparent text-[#9A6440]"
          : "bg-gradient-to-r dark:from-[#994D0E] dark:to-[#E2914F] from-[#D97A2B] to-[#E2914F]"
      }`}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
    >
      <div className={clsx("flex gap-2 justify-center", className)}>
        <div> {text}</div>
        {iconSrc && <img src={iconSrc} alt="" />}
      </div>
    </button>
  );
};

export default Button;
