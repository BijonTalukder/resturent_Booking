import React, { useState, useEffect } from "react";
import { LeftCircleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useGetDivisionsQuery } from "../../redux/Feature/User/place/placeApi";

const Division = () => {
  const [divisions, setDivisions] = useState([]);
  const { data: divisionsData, isLoading, isError } = useGetDivisionsQuery();

  useEffect(() => {
    if (divisionsData) {
      setDivisions(divisionsData.data); // Assuming the API returns { data: [...] }
    }
  }, [divisionsData]);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div>Loading divisions...</div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen">
      <div>Error loading divisions</div>
    </div>
  );

  return (
    <>

      <div className="w-full max-w-md mx-auto bg-white min-h-screen p-4 space-y-6 mb-16">
        <div className="space-y-2">
          <h3 className="text-md text-center font-bold mb-3">Select Division</h3>
          <ul className="space-y-2">
            {divisions.map((division, idx) => (
              <Link key={idx} to={`/district/${division?.serialId}`}>
              <li
                key={idx}
                className="bg-blue-100 px-4 py-3 rounded shadow text-center cursor-pointer hover:bg-blue-200 mb-3"
              >
                {division.name}
              </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Division;