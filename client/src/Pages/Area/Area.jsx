import React, { useState, useEffect } from "react";
import { LeftCircleFilled } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useGetAreasByDistrictQuery } from "../../redux/Feature/User/place/placeApi";

const Area = () => {
  const { districtId } = useParams();
  const [areas, setAreas] = useState([]);
  const { data: areasData, isLoading, isError } = useGetAreasByDistrictQuery(districtId);

  useEffect(() => {
    if (areasData) {
      setAreas(areasData.data);
    }
  }, [areasData]);

  if (areasData?.data?.length === 0) return (
    <div className="flex justify-center items-center min-h-screen bg-[#eef0f4]">
      <div className="neu-sm p-4 text-[#6b7588]">No areas found</div>
    </div>
  );

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#eef0f4]">
      <div className="neu-sm p-4 text-[#6b7588]">Loading areas...</div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen bg-[#eef0f4]">
      <div className="neu-sm p-4 text-red-500">Error loading areas</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eef0f4] p-4">
      <div className="w-full max-w-md mx-auto">
        <h3 className="text-lg font-bold text-center text-[#373b43] mb-4">Select Area</h3>
        <div className="space-y-3">
          {areas.map((area, idx) => (
            <Link to={`/hotel/${area.id}`} key={idx}>
              <div className="neu-card px-4 py-4 text-center cursor-pointer hover:shadow-neu-sm transition-all">
                <span className="text-[#484f5c] font-medium">{area.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Area;
