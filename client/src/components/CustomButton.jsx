import React from "react";

const CustomButton = ({ btntype, title, handleClick, styles }) => {
  return (
    <button
      type={btntype}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[100px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
