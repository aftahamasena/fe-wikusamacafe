import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/sidebar.jsx';
import Navbar from '../../components/admin/navbar.jsx';
import axios from 'axios';
import md5 from 'md5';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaHome,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    nama_user: '',
    role: 'kasir',
    username: '',
    password: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
      setOriginalUsers(response.data.data);
      setTotalItems(response.data.data.length);
    } catch (error) {
      console.error(
        'Error fetching users:',
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/user', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error(
        'Error adding user:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Destructure id_user, createdAt, and updatedAt to exclude them from the updatedUser object
    const { id_user, createdAt, updatedAt, ...updatedUser } = newUser;

    // If password is provided, hash it, otherwise remove it from the request
    if (updatedUser.password) {
      updatedUser.password = md5(updatedUser.password); // Hash the password if provided
    } else {
      delete updatedUser.password; // Remove password if it's not changed
    }

    try {
      await axios.put(
        `http://localhost:3000/user/${currentUser.id_user}`, // Send the ID in the URL, not in the body
        updatedUser, // Excluding createdAt, updatedAt, and id_user
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      resetForm(); // Clear the form
      fetchUsers(); // Reload the users list
    } catch (error) {
      console.error(
        'Error updating user:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteUser = async (id_user) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/user/${id_user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error(
        'Error deleting user:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const resetForm = () => {
    setNewUser({ nama_user: '', role: 'kasir', username: '', password: '' });
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentUser(null);
  };

  const openEditModal = (user) => {
    setNewUser({
      ...user,
      password: '', // Kosongkan password saat edit
    });
    setCurrentUser(user);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredUsers = originalUsers.filter(
      (user) =>
        user.nama_user.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        user.role.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setUsers(filteredUsers);
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <div className="flex-1 pl-72 py-24 font-poppins bg-gray-50 min-h-screen pr-8">
        <div className="flex justify-between">
          <div className="flex">
            <FaHome className="mt-1 text-md text-black" />
            <h1 className="text-md mb-2 ml-2">Admin / User</h1>
          </div>
          <h2 className="text-md mb-1 text-gray-500">
            Total User :{' '}
            <span className=" font-bold text-black">{totalItems}</span>
          </h2>{' '}
        </div>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-blue-700 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center text-xs"
            >
              <FaPlus className="mr-1" />
              Add User
            </button>
          </div>
          <div>
            <form onSubmit={handleSearch} className="flex flex-grow">
              <input
                type="text"
                placeholder="Search User..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="border rounded-l-lg p-2 w-48 focus:outline-none text-xs"
              />
              <button
                type="submit"
                className="bg-green-700 text-white rounded-r-lg px-3 py-2 hover:bg-green-600 transition duration-200 flex items-center text-xs"
              >
                <FaSearch className="mr-1" />
                Search
              </button>
            </form>
          </div>
        </div>
        <table className="min-w-full text-gray-800 bg-white shadow-lg rounded-lg mt-4 text-sm">
          <thead className="border-b border-gray-200">
            <tr className="text-center">
              <th className=" p-3">Nama User</th>
              <th className=" p-3">Role</th>
              <th className=" p-3">Username</th>
              <th className=" p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id_user}
                className="hover:bg-gray-100 border-b border-gray-200 text-center justify-center"
              >
                <td className="p-2">{user.nama_user}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.username}</td>
                <td className="py-3 px-4 text-sm">
                  <button
                    onClick={() => openEditModal(user)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-200"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id_user)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-200 ml-2"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center text-sm">
            <div className="fixed inset-0" onClick={() => resetForm()} />
            <div className="bg-white p-6 rounded z-10 shadow-lg w-3/12">
              <h2 className="text-xl font-bold mb-4">
                {isEditMode ? 'Edit User' : 'Add User'}
              </h2>
              <form onSubmit={isEditMode ? handleEditUser : handleAddUser}>
                <div>
                  <label className="block mb-1 text-sm">Nama User</label>
                  <input
                    type="text"
                    name="nama_user"
                    value={newUser.nama_user}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 w-full p-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Role</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 w-full p-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kasir">Kasir</option>
                    <option value="manajer">Manajer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 w-full p-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="border border-gray-300 w-full p-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end mt-4">
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

export default UserPage;
