import React, { useState, useEffect } from "react";
import { LeftCircleFilled } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useGetDistrictsByDivisionQuery } from "../../redux/Feature/User/place/placeApi";

const District = () => {
  const { divisionId } = useParams();
  const [districts, setDistricts] = useState([]);
  const { data: districtsData, isLoading, isError } = useGetDistrictsByDivisionQuery(divisionId);

  useEffect(() => {
    if (districtsData) {
      setDistricts(districtsData.data);
    }
  }, [districtsData]);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#eef0f4]">
      <div className="neu-sm p-4 text-[#6b7588]">Loading districts...</div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen bg-[#eef0f4]">
      <div className="neu-sm p-4 text-red-500">Error loading districts</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eef0f4] p-4">
      <Link to="/division">
        <span className="neu-btn inline-flex items-center justify-center w-10 h-10 mb-4">
          <LeftCircleFilled className="text-lg text-[#6b7588]" />
        </span>
      </Link>
      <div className="w-full max-w-md mx-auto">
        <h3 className="text-lg font-bold text-center text-[#373b43] mb-4">Select District</h3>
        <div className="space-y-3">
          {districts.map((district, idx) => (
            <Link to={`/area/${district.id}`} key={idx}>
              <div className="neu-card px-4 py-4 text-center cursor-pointer hover:shadow-neu-sm transition-all">
                <span className="text-[#484f5c] font-medium">{district.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default District;
