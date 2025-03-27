import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loader,search } from "../assets";
import FundCard from "./FundCard";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate(); //init the useNavigate
  const [searchQuery, setSearchQuery] = useState(""); //init the searchQuery

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.id}`, { state: campaign });
  };

  const campaignsWithIds = campaigns.map((campaign, index) => ({
    ...campaign,
    id: campaign.id || `campaign-${index}`, // Generate a fallback ID
  }));

  // Filter campaigns based on search query
  const filteredCampaigns = campaignsWithIds.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="lg:flex-1 flex flex-row max-w-[680px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search campaigns..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mt-2 mb-2 p-2  rounded-md flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
      />
      <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
        <img
          src={search}
          alt="search"
          className="w-[15px] h-[15px] object-contain"
        />
        </div>
      </div>
      <h1 className="text-white text-left text-[18px] mt-5 font-epilogue font-semibold">
        {title} ({filteredCampaigns.length})
      </h1>
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {/* setting the loader and image of individual campaign */}
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}
        {/* Check for when no campaign is created */}
        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold leading-[30px] text-[14px] text-[#818183]">
            You don't have any created Campaigns yet!!
          </p>
        )}
        {/* check to display campaigns */}

        {!isLoading &&
          campaigns.length > 0 &&
          filteredCampaigns.map((campaign) => (
            <FundCard
              key={campaign.id}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
