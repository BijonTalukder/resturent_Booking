import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCreateAreaMutation } from "../../../../redux/Feature/Admin/area/areaApi";

const CreateAreaForm = () => {
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    bn_name: "",
    districtId: "",
  });

  const [createArea, { isLoading, isSuccess, isError, error }] = useCreateAreaMutation();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/district")
      .then((res) => setDistricts(res.data.data))
      .catch((err) => console.error("Failed to load districts", err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createArea(formData).unwrap();
      alert("Area created successfully!");
      setFormData({ name: "", bn_name: "", districtId: "" }); // Reset form
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
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Area"}
        </button>

        {isError && <p className="text-red-600">Failed to create area: {error?.data?.message || error?.error}</p>}
        {isSuccess && <p className="text-green-600">Area created successfully!</p>}
      </form>
    </div>
  );
};

export default CreateAreaForm;
