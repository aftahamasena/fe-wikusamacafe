import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/sidebar.jsx';
import Navbar from '../../components/admin/navbar.jsx';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaAngleLeft,
  FaAngleRight,
  FaHome,
} from 'react-icons/fa';

const MejaPage = () => {
  const [mejaData, setMejaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [newMeja, setNewMeja] = useState({ nomor_meja: '', status: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMejaId, setEditingMejaId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');

  const token = localStorage.getItem('token');

  const fetchMejaData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/meja', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMejaData(response.data.data);
      setFilteredData(response.data.data);
      setTotalItems(response.data.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchMejaData();
  }, []);

  useEffect(() => {
    if (selectedStatus) {
      const filtered = mejaData.filter(
        (meja) => meja.status === selectedStatus
      );
      setFilteredData(filtered);
      setTotalItems(filtered.length);
    } else {
      setFilteredData(mejaData);
      setTotalItems(mejaData.length);
    }
  }, [selectedStatus, mejaData]);

  const handleInputChange = (e) => {
    setNewMeja({ ...newMeja, [e.target.name]: e.target.value });
  };

  const handleSaveMeja = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:3000/meja/${editingMejaId}`,
          newMeja,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:3000/meja', newMeja, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchMejaData();
      resetForm();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleEditMeja = (meja) => {
    setNewMeja({ nomor_meja: meja.nomor_meja, status: meja.status });
    setIsEditMode(true);
    setEditingMejaId(meja.id_meja);
    setShowModal(true);
  };

  const handleDeleteMeja = async (id_meja) => {
    try {
      await axios.delete(`http://localhost:3000/meja/${id_meja}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMejaData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleAddMeja = () => {
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setNewMeja({ nomor_meja: '', status: 'kosong' });
    setIsEditMode(false);
    setEditingMejaId(null);
    setShowModal(false);
  };

  const indexOfLastMeja = currentPage * itemsPerPage;
  const indexOfFirstMeja = indexOfLastMeja - itemsPerPage;
  const currentMeja = filteredData.slice(indexOfFirstMeja, indexOfLastMeja);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <div className="flex-1 pl-72 py-24 font-poppins bg-gray-50 min-h-screen pr-8">
        <div className="flex justify-between items-center">
          <div className="flex">
            <FaHome className="mt-1 text-md text-black" />
            <h1 className="text-md mb-2 ml-2">Admin / Meja</h1>
          </div>
          <h2 className="text-md mb-1 text-gray-500">
            Total Meja :{' '}
            <span className="font-bold text-black">{totalItems}</span>
          </h2>
        </div>

        <div className="flex justify-between">
          <div>
            <button
              className="bg-blue-700 text-white px-3 py-2 rounded-lg mb-4 flex items-center text-xs"
              onClick={handleAddMeja}
            >
              <FaPlus className="mr-2" /> Add Meja
            </button>
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded-lg p-2 focus:outline-none text-xs"
            >
              <option value="">Select Status</option>
              <option value="terisi">Terisi</option>
              <option value="kosong">Kosong</option>
            </select>
          </div>
        </div>

        <table className="min-w-full text-gray-800 bg-white shadow-lg rounded-lg text-sm">
          <thead className="border-b border-gray-200">
            <tr className=" text-center ">
              <th className="p-3">Nomor Meja</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMeja.map((meja) => (
              <tr
                key={meja.id_meja}
                className="hover:bg-gray-100 border-b border-gray-200 text-sm text-center"
              >
                <td className="p-2">{meja.nomor_meja}</td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`py-1 px-3 rounded-full ${
                      meja.status === 'kosong'
                        ? 'bg-green-400 text-white'
                        : 'bg-red-400 text-white'
                    }`}
                  >
                    {meja.status === 'kosong' ? 'Kosong' : 'Terisi'}
                  </span>
                </td>
                <td className="p-2 flex items-center justify-center">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-200"
                    onClick={() => handleEditMeja(meja)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-200 ml-2"
                    onClick={() => handleDeleteMeja(meja.id_meja)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4 items-center my-4 text-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-200 text-black rounded-lg px-4 py-2 hover:bg-gray-300 transition duration-200 flex items-center"
          >
            <FaAngleLeft className="mr-1" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-200 text-black rounded-lg px-4 py-2 hover:bg-gray-300 transition duration-200 flex items-center"
          >
            <FaAngleRight className="ml-1" />
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center text-sm">
            <div className="fixed inset-0" onClick={() => resetForm()} />
            <div className="bg-white p-6 rounded z-10 shadow-lg w-3/12">
              <h2 className="text-xl font-bold mb-4">
                {isEditMode ? 'Edit Meja' : 'Tambah Meja'}
              </h2>
              <form onSubmit={handleSaveMeja}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm">Nomor Meja</label>
                  <input
                    type="text"
                    name="nomor_meja"
                    value={newMeja.nomor_meja}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm">Status</label>
                  <select
                    name="status"
                    value={newMeja.status}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Status</option>
                    <option value="terisi">Terisi</option>
                    <option value="kosong">Kosong</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-500 transition duration-200 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    {isEditMode ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MejaPage;
