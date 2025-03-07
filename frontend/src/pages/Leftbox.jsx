import React from 'react';
import { Heart } from 'lucide-react';

export function Leftbox({ label1, label2, label3, count }) {
  return (
    <div className="w-2/5 bg-green-50 p-6 flex flex-col items-center justify-center rounded-lg shadow-md border-l-4 border-green-500">
      {count > 0 && (
        <div className="flex items-center justify-center mb-6 bg-white px-4 py-2 rounded-full shadow-sm">
          <span className="text-lg font-bold text-green-600">{count}</span>
          <span className="text-gray-600 ml-1">of 7</span>
        </div>
      )}
      
      <Heart className="text-green-500 mb-4" size={40} />
      
      <div className="text-gray-800 font-bold text-4xl text-center mb-4">
        {label1} <br /> {label2}
      </div>
      
      <div className="text-gray-600 font-medium text-xl text-center mt-4 max-w-sm">
        {label3}
      </div>
      
     
    </div>
  );
}

export default Leftbox;