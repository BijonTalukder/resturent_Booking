import { Sidebar } from 'primereact/sidebar';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { InputNumber } from 'primereact/inputnumber';

const Adjustment = ({ visibleRight, setVisibleRight }) => {
  const [divisions, setDivisions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000)); // Next day
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);

  // Fetch divisions on component mount
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

  // Fetch cities when division is selected
  useEffect(() => {
    if (selectedDivision) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://bdapi.vercel.app/api/v.1/district/${selectedDivision}`);
          setCities(response.data.data.map(city => ({
            label: city.name,
            value: city.id
          })));
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    }
  }, [selectedDivision]);

  const handleSearch = () => {
    const searchParams = {
      division: selectedDivision ? divisions.find(d => d.value === selectedDivision)?.label : 'Any',
      city: selectedCity ? cities.find(c => c.value === selectedCity)?.label : 'Any',
      checkIn: checkInDate.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0],
      guests,
      rooms
    };
    console.log('Search Parameters:', searchParams);
    // You would typically pass these to your search function here
    setVisibleRight(false);
  };

  return (
    <Sidebar
      visible={visibleRight}
      position="bottom"
      onHide={() => setVisibleRight(false)}
      className="w-full md:w-[500px] h-[300px]  lg:h-[500px]  mx-auto rounded-t-2xl"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Modify Your Search</h2>
      
      <div className="grid gap-4">
        {/* Division Selection */}
        <div className="field">
          <label htmlFor="division" className="block font-medium mb-2">Division</label>
          <Dropdown
            id="division"
            value={selectedDivision}
            options={divisions}
            onChange={(e) => {
              setSelectedDivision(e.value);
              setSelectedCity(null); // Reset city when division changes
            }}
            optionLabel="label"
            placeholder="Select a Division"
            className="w-full"
          />
        </div>

        {/* City Selection */}
        <div className="field">
          <label htmlFor="city" className="block font-medium mb-2">City/Area</label>
          <Dropdown
            id="city"
            value={selectedCity}
            options={cities}
            onChange={(e) => setSelectedCity(e.value)}
            optionLabel="label"
            placeholder="Select a City"
            className="w-full"
            disabled={!selectedDivision}
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="field">
            <label htmlFor="checkIn" className="block font-medium mb-2">Check In</label>
            <Calendar
              id="checkIn"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.value)}
              dateFormat="dd M yy"
              minDate={new Date()}
              className="w-full"
            />
          </div>
          <div className="field">
            <label htmlFor="checkOut" className="block font-medium mb-2">Check Out</label>
            <Calendar
              id="checkOut"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.value)}
              dateFormat="dd M yy"
              minDate={checkInDate}
              className="w-full"
            />
          </div>
        </div>

        {/* Guests and Rooms */}
        <div className="grid grid-cols-1  gap-4">
          <div className="field">
            <label htmlFor="guests" className="block font-medium mb-2">Guests</label>
            <InputNumber
              id="guests"
              value={guests}
              onValueChange={(e) => setGuests(e.value)}
              min={1}
              max={20}
              showButtons
              className="w-full"
            />
          </div>
          <div className="field">
            <label htmlFor="rooms" className="block font-medium mb-2">Rooms</label>
            <InputNumber
              id="rooms"
              value={rooms}
              onValueChange={(e) => setRooms(e.value)}
              min={1}
              max={10}
              showButtons
              className="w-full"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6">
          <button
            onClick={handleSearch}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Sidebar>
  );
};

export default Adjustment;