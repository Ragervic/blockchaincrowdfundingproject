import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { CustomButton, CountBox, Loader } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";
import Modal from "../components/Modal";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  };
  // Calling the fetchDonators function as soon as the campaign-details page loads
  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    // Checking if the user has connected their wallet
     if (!address) {
       setModalMessage("Please connect your wallet before making a donation.");
       setIsModalOpen(true);
       return;
     }
    // Checking if the campaign has reached its target
    if (state.amountCollected >= state.target) {
      setModalMessage("This campaign is no longer accepting donations.");
      setIsModalOpen(true);
      return;
    }
    // Checking the input amount
    if (!amount || parseFloat(amount) <= 0) {
      setModalMessage("Please enter a valid amount to donate.");
      setIsModalOpen(true);
      return;
    }
    // Checking if the deadline is reached
    if (remainingDays <= 0) {
      setModalMessage("This campaign has ended.");
      setIsModalOpen(true);
      return;
    }
    // Checking if the user has entered a valid amount to donate
    if (parseFloat(amount) > state.target - state.amountCollected) {
      setModalMessage(
        "Please enter a valid amount that does not exceed the donation."
      );
      setIsModalOpen(true);
      return;
    }
    setIsLoading(true);

    try {
      await donate(state.pId, amount);
      navigate("/");
    } catch (error) {
      console.error("Donation failed", error);
      setModalMessage("Donation failed. Please try again.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false); //After successful donation we set the loading to false
    }
  };

  console.log(state);
  return (
    <div>
      {isLoading && <Loader />}
      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Campaign error!"
        message={modalMessage}
      />
      <div
        className="w-full flex md:flex-row flex-col
      mt-10 gap-[30px]"
      >
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            {/* Percentage of contributions */}
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>
        {/* Count boxes */}
        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>
      {/* Creator, Story, Fund */}
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          {/* Info1 */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              {/* Image */}
              <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user-address"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              {/* Address */}
              <div>
                <h4 className="font-epilogue font-semibold text-white text-[14px] break-all">
                  {state.owner}
                </h4>
                {/* <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  {} Campaigns
                </p> */}
              </div>
            </div>
          </div>
          {/* Info2 */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Story
            </h4>
            {/* Description */}
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] leading-[26px] text-justify text-[#808191]">
                {state.description}
              </p>
            </div>
          </div>
          {/* Donators */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Donators
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4 "
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                      {index + 1}.{item.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] leading-[26px] text-justify text-[#808191]">
                  No donators yet. Be the first!
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Fund */}
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Fund
          </h4>
          {/* Wrapper */}
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-[#808191] text-center">
              Fund the Campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              {/* Cause banner */}
              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Back it because you believe in it!
                </h4>
                <p className="font-epilogue font-normal mt-[20px] leading-[22px] text-[#808191]">
                  Support the project for no reward, just because it speaks to
                  you
                </p>
              </div>
              {/* Fund Button */}
              <CustomButton
                btntype="button"
                title="Fund Campaign"
                styles={`w-full ${
                  state.amountCollected >= state.target
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#8c6dfd]"
                }`}
                handleClick={handleDonate}
                disabled={
                  state.amountCollected >= state.target || remainingDays <= 0
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
