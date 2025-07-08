import { useState } from "react";
import { Leftbox } from "../pages/Leftbox";
import { First } from "./First";
import { Second } from "./Second";
import { Third } from "./third";
import { Fourth } from "./Fourth";
import { Fifth } from "./Fifth";
import { Six } from "./Six";
import { Seventh } from "./Seventh";
import AccountDetailsForm from "./AccountDetailsForm";

export function Create() {
  const [count, setCount] = useState(0);
  const [formdata, setFormData] = useState({
    category: "",
    targetAmount: 0,
    type: "",
    image: null,
    description: "",
    title: "",
    name: "",
    email: "",
    upiId: "",
  });
  
  // Function to update formdata
  const handleUpdate = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Next and Previous handlers
  const handleNext = () => setCount((prev) => prev + 1);
  const handlePrev = () => setCount((prev) => prev - 1);

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      {count === 0 && (
        <Leftbox
          label1={"Let's Begin Your"}
          label2={"Fundraising Journey"}
          label3={"We are here to guide you every step of the way."}
          count={count}
        />
      )}
      {count === 1 && (
        <Leftbox
          label1={"Tell us who you're"}
          label2={"raising funds for"}
          label3={"This information helps us get to know you and your fundraising needs"}
          count={count}
        />
      )}
      {count === 2 && (
        <Leftbox
          label1={"Set your starting goal"}
          label2={""}
          label3={"You can always change your goal as you go."}
          count={count}
        />
      )}
      {count === 3 && (
        <Leftbox
          label1={"Add a cover photo"}
          label2={"or video"}
          label3={"Using a bright and clear photo helps people connect to your fundraiser right away."}
          count={count}
        />
      )}
      {count === 4 && (
        <Leftbox
          label1={"Tell Donors your story"}
          label2={""}
          label3={""}
          count={count}
        />
      )}
      {count === 5 && (
        <Leftbox
          label1={"Give your fundraiser "}
          label2={"a title"}
          label3={"Write your own title for your story to get started"}
          count={count}
        />
      )}
      {count === 6 && (
        <Leftbox
          label1={"Enter your bank "}
          label2={"account details"}
          label3={"Enter your account details  where you want your funds transfered."}
          count={count}
        />
      )}
      {count === 7 && (
        <Leftbox
          label1={"Review your fundraiser "}
          label2={""}
          label3={"Let's make sure your fundraiser is complete."}
          count={count}
        />
      )}

      {/* Right Section */}
      <div className="w-3/5 bg-white rounded-lg p-4">
        {count === 0 && (
          <First
            onSelect={(category) => handleUpdate({ category })}
            selectedCategory={formdata.category}
            handleNext={handleNext}
          />
        )}
        {count === 1 && (
          <Second
            onSelect={(type) => handleUpdate({ type })}
            selectedType={formdata.type}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}
        {count === 2 && (
          <Third
            onSelect={(targetAmount) => handleUpdate({ targetAmount })}
            selectedTargetAmount={formdata.targetAmount}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )} 
        {count === 3 && (
          <Fourth
            onSelect={(image) => handleUpdate({ image })}
            selectedImage={formdata.image}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}
        {count === 4 && (
          <Fifth
            onSelect={(description) => handleUpdate({ description })}
            selectedDescription={formdata.description}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}
        {count === 5 && (
          <Six 
            onSelect={(data) => handleUpdate(data)} 
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}
        {count === 6 && (
          <AccountDetailsForm 
            onNext={(data) => handleUpdate(data)}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}
        {count === 7 && (
          <Seventh 
            formdata={formdata} 
            handlePrev={handlePrev}
          />
        )}
      </div>
    </div>
  );
}