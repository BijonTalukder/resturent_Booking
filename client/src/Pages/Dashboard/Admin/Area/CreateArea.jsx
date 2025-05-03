import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateAreaForm = () => {
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    bn_name: "",
    districtId: "",
  });

  useEffect(() => {
    // Fetch districts
    axios.get("/districts")
      .then(res => setDistricts(res.data.data))
      .catch(err => console.error("Failed to load districts", err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/area/create", formData);
      alert("Area created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating area");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <h2 className="text-xl font-semibold mb-4">Create New Area</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Area Name (English)</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Area Name (Bangla)</label>
          <input
            type="text"
            name="bn_name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.bn_name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Select District</label>
          <select
            name="districtId"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.districtId}
            required
          >
            <option value="">-- Select District --</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Area
        </button>
      </form>
    </div>
  );
};

export default CreateAreaForm;
