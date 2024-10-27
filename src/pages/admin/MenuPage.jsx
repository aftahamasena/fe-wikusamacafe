import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Sidebar from '../../components/admin/sidebar.jsx';
import Navbar from '../../components/admin/navbar.jsx';
import {
  FaHome,
  FaPlus,
  FaEdit,
  FaTrash,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [originalMenus, setOriginalMenus] = useState([]);
  const [formData, setFormData] = useState({
    nama_menu: '',
    jenis: 'makanan',
    deskripsi: '',
    harga: '',
    gambar: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await Axios.get('http://localhost:3000/menu', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        setMenus(response.data.data);
        setOriginalMenus(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, gambar: e.target.files[0] });
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await Axios.post('http://localhost:3000/menu', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status) {
        fetchMenus();
        resetForm();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditMenu = async (menu) => {
    setFormData(menu);
    setEditMode(true);
    setSelectedMenuId(menu.id_menu);
    setShowModal(true);
  };

  const handleUpdateMenu = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await Axios.put(
        `http://localhost:3000/menu/${selectedMenuId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.status) {
        fetchMenus();
        resetForm();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      const response = await Axios.delete(`http://localhost:3000/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        fetchMenus();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      nama_menu: '',
      jenis: 'makanan',
      deskripsi: '',
      harga: '',
      gambar: null,
    });
    setEditMode(false);
    setSelectedMenuId(null);
    setShowModal(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  const limitDescription = (description) => {
    const words = description.split(' ');
    return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : description;
  };

  const indexOfLastMenu = currentPage * itemsPerPage;
  const indexOfFirstMenu = indexOfLastMenu - itemsPerPage;
  const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);
  const totalPages = Math.ceil(menus.length / itemsPerPage);

  // Menggunakan useEffect untuk filter otomatis saat searchKeyword berubah
  useEffect(() => {
    const filteredMenus = originalMenus.filter(
      (menu) =>
        menu.nama_menu.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        menu.jenis.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        menu.deskripsi.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setMenus(filteredMenus);
    setCurrentPage(1); // Reset ke halaman pertama ketika filter berubah
  }, [searchKeyword, originalMenus]);

  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <div className="flex-1 pl-72 py-24 font-poppins bg-gray-50 pr-8">
        <div className="flex justify-between">
          <div className="flex">
            <FaHome className="mt-1 text-md text-black" />
            <h1 className="text-md mb-2 ml-2">Admin / Menu</h1>
          </div>
          <h2 className="text-md mb-1 text-gray-500">
            Total Menu :{' '}
            <span className=" font-bold text-black">{menus.length}</span>
          </h2>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-blue-700 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center text-xs"
            >
              <FaPlus className="mr-1" />
              Add Menu
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search Menu..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="border rounded-lg p-2 w-48 focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* <h2 className="text-md mb-1">Menu List</h2> */}
        <table className="min-w-full text-gray-800 bg-white shadow-lg rounded-lg mt-4">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-sm text-left">Gambar</th>
              <th className="py-3 w-44 text-sm text-left">Nama Menu</th>
              <th className="py-3 px-4 text-sm text-left">Jenis</th>
              <th className="py-3 px-4 text-sm text-left">Deskripsi</th>
              <th className="py-3 px-4 text-sm text-left">Harga</th>
              <th className="py-3 px-4 text-sm text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMenus.map((menu) => (
              <tr
                key={menu.id_menu}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                <td className="py-3 px-4">
                  <img
                    src={`http://localhost:3000/images/${menu.gambar}`}
                    alt={menu.nama_menu}
                    className="w-24 h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="py-3 text-sm w-44">{menu.nama_menu}</td>
                <td className="py-3 px-4 text-sm">{menu.jenis}</td>
                <td className="py-3 px-4 text-sm">
                  {limitDescription(menu.deskripsi)}
                </td>
                <td className="py-3 px-4 text-sm">
                  {formatCurrency(menu.harga)}
                </td>
                <td className="py-3 px-4 text-sm">
                  <button
                    onClick={() => handleEditMenu(menu)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-200"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(menu.id_menu)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-200 ml-2"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4 items-center my-4">
          <button
            onClick={() =>
              setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
            }
            className="bg-gray-200 text-black rounded-lg px-4 py-2 hover:bg-gray-300 transition duration-200 flex items-center"
          >
            <FaAngleLeft />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(
                currentPage < totalPages ? currentPage + 1 : totalPages
              )
            }
            className="bg-gray-200 text-black rounded-lg px-4 py-2 hover:bg-gray-300 transition duration-200 flex items-center"
          >
            <FaAngleRight />
          </button>
        </div>

        {/* Add/Edit Menu Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="fixed inset-0" onClick={() => resetForm()} />
            <div className="bg-white p-6 rounded-lg shadow-lg w-4/12 text-sm z-10">
              <h2 className="text-xl font-bold mb-4">
                {editMode ? 'Edit Menu' : 'Add Menu'}
              </h2>
              <form onSubmit={editMode ? handleUpdateMenu : handleAddMenu}>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Nama Menu:</label>
                  <input
                    type="text"
                    name="nama_menu"
                    value={formData.nama_menu}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Jenis:</label>
                  <select
                    name="jenis"
                    value={formData.jenis}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="makanan">Makanan</option>
                    <option value="minuman">Minuman</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Deskripsi:</label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Harga:</label>
                  <input
                    type="number"
                    name="harga"
                    value={formData.harga}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Gambar:</label>
                  <input
                    type="file"
                    name="gambar"
                    onChange={handleFileChange}
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    {editMode ? 'Update Menu' : 'Add Menu'}
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

export default MenuPage;
