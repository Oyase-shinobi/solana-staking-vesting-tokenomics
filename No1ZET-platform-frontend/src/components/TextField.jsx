import React from "react";

const TextField = ({ label, placeholder, type, id, name, onChange }) => {
  return (
    <div className="w-full">
      <div className="flex gap-1">
        <p className="text-sm dark:text-white text-title-light">{label}</p>
        <img src="/icons/info.svg" alt="" />
      </div>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          className="w-full grow h-10 text-center bg-transparent rounded border-2 border-[#9D8B70] my-1"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default TextField;
