import React, { useState } from "react";

const divisions = ["Chittagong", "Dhaka", "Barisal", "Rangpur"];
const data = {
  Chittagong: ["Sitakund", "CoxBazar", "Rangamati", "Bandarban"],
  Dhaka: ["Gazipur", "Narayanganj"],
  Barisal: ["Patuakhali", "Bhola"],
  Rangpur: ["Dinajpur", "Thakurgaon"],
};

const AreaList=()=> {
  const [divisionIndex, setDivisionIndex] = useState(0);

  const selectedDivision = divisions[divisionIndex];
  const districts = data[selectedDivision];

  const goPrevious = () => {
    if (divisionIndex > 0) setDivisionIndex(divisionIndex - 1);
  };

  const goNext = () => {
    if (divisionIndex < divisions.length - 1) setDivisionIndex(divisionIndex + 1);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen p-4 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b pb-2">
        <button
          onClick={goPrevious}
          className="text-sm px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={divisionIndex === 0}
        >
          Prev
        </button>
        <h2 className="text-lg font-semibold">{selectedDivision}</h2>
        <button
          onClick={goNext}
          className="text-sm px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={divisionIndex === divisions.length - 1}
        >
          Next
        </button>
      </div>

      {/* District List */}
      <div className="space-y-2">
        <h3 className="text-md font-medium">Districts in {selectedDivision}</h3>
        <ul className="space-y-2">
          {districts.map((district, idx) => (
            <li
              key={idx}
              className="bg-blue-100 px-4 py-3 rounded shadow text-center cursor-pointer hover:bg-blue-200"
            >
              {district}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default AreaList