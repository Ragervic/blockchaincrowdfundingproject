import React from "react";

import { tagType, thirdweb } from "../assets";
import { daysLeft } from "../utils";

const FundCard = ({
  owner,
  title,
  description,
  amountCollected,
  image,
  deadline,
  target,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);
  return (
    //   Main display
    <div
      className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer"
      onClick={handleClick}
    >
      {/* Campaign image */}
      <img
        src={image}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-[15px]"
      />
      {/* Info div */}
      <div className="flex flex-col p-4">
        {/* tag category */}
        <div className="flex flex-row items-center mb-[18px]">
          <img
            src={tagType}
            alt="tag"
            className="w-[17px] h-[17px] object-contain"
          />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">
            Category
          </p>
        </div>
        {/* campaign information */}
        <div className="block">
          <h3 className="font-epilogue font-semibold leading-[26px] truncate text-[16px] text-white text-left">
            {title}
          </h3>
          <p className="mt-[5px] font-normal font-epilogue text-[#808191] text-left leading-[18px] truncate">
            {description}
          </p>
        </div>
        <div className="justify-between flex flex-wrap mt-[15px] gap-2">
          {/* amount collected */}
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold leading-[22px] text-[14px] text-[#b2b3bd]">
              {amountCollected}
            </h4>
            <p className="mt-[3px] font-normal font-epilogue text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Raised of {target}
            </p>
          </div>
          {/* Days left */}
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold leading-[22px] text-[14px] text-[#b2b3bd]">
              {remainingDays}
            </h4>
            <p className="mt-[3px] font-normal font-epilogue text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Days Left
            </p>
          </div>
        </div>
        {/* Owner address display */}
        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-[#13131a]">
            <img
              src={thirdweb}
              alt="user"
              className="h-1/2 w-1/2 object-contain"
            />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
            {" "}
            by <span className="text-[#b2b3bd]">{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
