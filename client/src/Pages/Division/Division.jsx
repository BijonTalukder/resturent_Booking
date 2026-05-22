import React, { useState, useEffect } from "react";
import { LeftCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetDivisionsQuery } from "../../redux/Feature/User/place/placeApi";

const Division = ({ onDivisionClick }) => {
  const [divisions, setDivisions] = useState([]);
  const { data: divisionsData, isLoading, isError } = useGetDivisionsQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (divisionsData) {
      setDivisions(divisionsData.data);
    }
  }, [divisionsData]);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#eef0f4]">
      <div className="neu-sm p-4 text-[#6b7588]">Loading divisions...</div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen bg-[#eef0f4]">
      <div className="neu-sm p-4 text-red-500">Error loading divisions</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eef0f4] p-4">
      <div className="w-full max-w-md mx-auto space-y-4">
        <h3 className="text-lg font-bold text-center text-[#373b43] mb-4">Select Division</h3>
        <div className="space-y-3">
          {divisions.map((division, idx) => (
            <div
              key={idx}
              onClick={() => {
                navigate(`/district/${division?.serialId}`);
                onDivisionClick && onDivisionClick();
              }}
              className="neu-card px-4 py-4 text-center cursor-pointer hover:shadow-neu-sm transition-all"
            >
              <span className="text-[#484f5c] font-medium">{division.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Division;
