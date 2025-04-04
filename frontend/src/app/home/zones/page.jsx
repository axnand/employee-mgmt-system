'use client'
import { useState, useEffect } from 'react';
import axiosClient from "@/api/axiosClient";
import { useRouter } from 'next/navigation';

const AddZonePage = () => {
  const [name, setName] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axiosClient.get('/districts'); // Ensure this route is configured in your backend
        setDistricts(response.data.districts);
      } catch (error) {
        console.error('Error fetching districts:', error.message);
      }
    };

    fetchDistricts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !selectedDistrict) {
      setError('Zone name and District are required');
      return;
    }

    try {
      const response = await axiosClient.post('/zones', { name, district: selectedDistrict });
      setSuccess('Zone added successfully!');
      setName('');
      setSelectedDistrict('');
    } catch (error) {
      console.error(error.message);
      setError('Failed to create zone. Make sure the zone name is unique within the selected district.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Add New Zone</h1>

        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Zone Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter zone name"
            />
          </div>

          <div>
            <label className="block text-gray-700">Select District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district._id} value={district._id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Zone
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddZonePage;
