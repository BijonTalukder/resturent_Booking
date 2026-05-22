import { Sidebar } from 'primereact/sidebar';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'antd';

const Adjustment = ({ 
  visibleRight, 
  setVisibleRight,
  selectedDivision,
  setSelectedDivision,
  selectedCity,
  setSelectedCity,
  onApplyFilters
}) => {
  const [divisions, setDivisions] = useState([]);
  const [cities, setCities] = useState([]);
  const [localDivision, setLocalDivision] = useState(selectedDivision);
  const [localCity, setLocalCity] = useState(selectedCity);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get("https://bdapi.vercel.app/api/v.1/division");
        setDivisions(response.data.data.map(div => ({
          label: div.name,
          value: div.id
        })));
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (localDivision) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://bdapi.vercel.app/api/v.1/district/${localDivision}`);
          setCities(response.data.data.map(city => ({
            label: city.name,
            value: city.id
          })));
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setLocalCity('');
    }
  }, [localDivision]);

  const handleApply = () => {
    setSelectedDivision(localDivision);
    setSelectedCity(localCity);
    onApplyFilters(localDivision, localCity);
    setVisibleRight(false);
  };

  const handleClearFilters = () => {
    setLocalDivision('');
    setLocalCity('');
    setCities([]);
  };

  return (
    <Sidebar
      visible={visibleRight}
      position="bottom"
      onHide={() => setVisibleRight(false)}
      className="w-full md:w-[500px] mx-auto rounded-t-2xl"
      style={{ background: "#eef0f4" }}
    >
      <h2 className="text-xl font-bold mb-4 text-center text-[#373b43]">Modify Your Search</h2>
      
      <div className="grid gap-4 overflow-y-auto p-4 mb-14">
        {/* Division Selection */}
        <div className="neu-card p-4">
          <label htmlFor="division" className="block font-medium mb-2 text-[#484f5c]">Division</label>
          <div className="neu-inset-sm rounded-xl overflow-hidden">
            <Dropdown
              id="division"
              value={localDivision}
              options={divisions}
              onChange={(e) => {
                setLocalDivision(e.value);
                setLocalCity('');
              }}
              optionLabel="label"
              placeholder="Select a Division"
              className="w-full"
            />
          </div>
        </div>

        {/* City Selection */}
        <div className="neu-card p-4">
          <label htmlFor="city" className="block font-medium mb-2 text-[#484f5c]">City/Area</label>
          <div className="neu-inset-sm rounded-xl overflow-hidden">
            <Dropdown
              id="city"
              value={localCity}
              options={cities}
              onChange={(e) => setLocalCity(e.value)}
              optionLabel="label"
              placeholder="Select a City"
              className="w-full"
              disabled={!localDivision}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex fixed bottom-0 gap-4 py-2 justify-center w-[90%] md:w-[450px] mx-auto bg-[#eef0f4] rounded-b-2xl">
        <button
          onClick={handleClearFilters}
          className="neu-btn flex-1 py-2.5 text-sm font-medium text-[#6b7588]"
        >
          Clear Filters
        </button>
        <button
          onClick={handleApply}
          className="neu-btn-primary flex-1 py-2.5 text-sm font-medium"
        >
          Apply Filters
        </button>
      </div>
    </Sidebar>
  );
};

export default Adjustment;
