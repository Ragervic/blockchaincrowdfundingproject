import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { money } from "../assets";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";

import { useStateContext } from "../context";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();

  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        // passing target data as wei which is 18 decimals
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        setIsLoading(false);
        navigate("/");
      } else {
        alert("Provide valid image!!");
        // reloads the entire form resetting the image field
        setForm({ ...form, image: "" });
      }
    });
    console.log(form);
  };

  return (
    <div className="bg-[#1c1c24] flex flex-col items-center justify-center rounded-[10px] sm:p-10 p-4 ">
      {isLoading && <Loader />}

      <div className="flex items-center justify-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-[30px] mt-[65px]"
      >
        <div className="flex flex-wrap gap-[40px] ">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>
        <FormField
          labelName="Story"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />
        <div className="w-full flex justify-center items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] object-contain"
          />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will get 100% of the raised funds
          </h4>
        </div>
        <div className="flex flex-wrap gap-[40px] ">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="int"
            value={form.target}
            handleChange={(e) => handleFormFieldChange("target", e)}
          />
          <FormField
            labelName="End Date*"
            placeholder="End date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>
        <FormField
          labelName="Campaign Image *"
          placeholder="Place your campaign image URL"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btntype="submit"
            title="Submit New Campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
