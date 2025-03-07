import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ src, label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/fundraisers/${label}`);
  };

  return (
    <div 
      className='flex flex-col items-center cursor-pointer' 
      onClick={handleClick}
    >
      <div className='bg-[#fbfaf8] w-44 h-44 flex justify-center items-center shadow-lg rounded-lg border-2 border-transparent hover:border-black transition-all duration-300'>
        <img 
          src={src} 
          className='h-16 w-16 object-cover'
          alt={`${label} Icon`}
        />
      </div>
      <p className='text-lg font-semibold mt-2 text-center'>{label}</p>
    </div>
  );
}

export default Card;
