import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/sidebar.jsx';
import Navbar from '../../components/admin/navbar.jsx';
import { FaTrash, FaAngleLeft, FaAngleRight, FaHome } from 'react-icons/fa';

const TransaksiPage = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [statusFilter, setStatusFilter] = useState('all');
  const token = localStorage.getItem('token');

  // Function to fetch all transactions
  const fetchAllTransaksi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/transaksi');
      if (response.data.status) {
        setTransaksi(response.data.data);
      } else {
        setError('Failed to fetch transactions.');
      }
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaksi = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/transaksi/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        fetchAllTransaksi(); // Refresh data
      } else {
        alert('Failed to delete transaction.');
      }
    } catch (error) {
      alert('Error deleting transaction');
    }
  };

  // Fetch transactions when the component mounts
  useEffect(() => {
    fetchAllTransaksi();
  }, []);

  // Filter and sort transactions
  const filteredTransaksi = transaksi
    .filter((item) => {
      const nameMatch =
        item.user.nama_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'lunas' && item.status === 'lunas') ||
        (statusFilter === 'belum_bayar' && item.status !== 'lunas');
      return nameMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortOption === 'latest') {
        return new Date(b.tgl_transaksi) - new Date(a.tgl_transaksi);
      } else if (sortOption === 'oldest') {
        return new Date(a.tgl_transaksi) - new Date(b.tgl_transaksi);
      }
      return 0;
    });

  // Pagination logic
  const indexOfLastTransaksi = currentPage * itemsPerPage;
  const indexOfFirstTransaksi = indexOfLastTransaksi - itemsPerPage;
  const currentTransaksi = filteredTransaksi.slice(
    indexOfFirstTransaksi,
    indexOfLastTransaksi
  );
  const totalPages = Math.ceil(filteredTransaksi.length / itemsPerPage);

  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <div className="flex-1 pl-72 py-24 font-poppins bg-gray-50 min-h-screen pr-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <FaHome className="-mt-2 text-md text-black" />
            <h1 className="text-md  ml-2">Admin / Transaksi</h1>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <h2 className="text-md mb-1 text-gray-500">
              Total Transaksi :{' '}
              <span className="font-bold text-black">
                {filteredTransaksi.length}
              </span>
            </h2>
          )}
        </div>

        {/* Dropdowns for Sorting */}
        <div className="flex mb- justify-between">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg p-2 w-64 focus:outline-none text-xs shadow-sm"
            />
          </div>
          <div className="space-x-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-lg p-2 focus:outline-none text-xs shadow-sm"
            >
              <option value="latest">Sort by Date (Terbaru)</option>
              <option value="oldest">Sort by Date (Terlama)</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg p-2 focus:outline-none text-xs shadow-sm"
            >
              <option value="all">Filter by Status (All)</option>
              <option value="lunas">Filter by Status (Lunas)</option>
              <option value="belum_bayar">
                Filter by Status (Belum Bayar)
              </option>
            </select>
          </div>
        </div>

        <table className="min-w-full text-gray-800 bg-white shadow-lg rounded-lg text-sm">
          <thead className="border-b border-gray-200">
            <tr className="text-center">
              <th className="p-3">Tanggal Transaksi</th>
              <th className="p-3">Nama Kasir</th>
              <th className="p-3">Nama Pelanggan</th>
              <th className="p-3">Meja</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total Harga</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTransaksi.map((item) => (
              <tr
                key={item.id_transaksi}
                className="hover:bg-gray-100 border-b border-gray-200 text-sm text-center"
              >
                <td className="py-3 px-6 text-center">
                  {new Date(item.tgl_transaksi).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 ">{item.user.nama_user}</td>
                <td className="py-3 px-6 ">{item.nama_pelanggan}</td>
                <td className="py-3 px-6 ">{item.meja.nomor_meja}</td>
                <td className="py-3 px-6 ">
                  <span
                    className={`py-1 px-3 rounded-full ${
                      item.status === 'lunas'
                        ? 'bg-green-400 text-white'
                        : 'bg-red-400 text-white'
                    }`}
                  >
                    {item.status === 'lunas' ? 'Lunas' : 'Belum Bayar'}
                  </span>
                </td>
                <td className="py-3 px-6">
                  {item.total_harga.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </td>
                <td className="p-2 flex items-center justify-center">
                  <button
                    onClick={() => deleteTransaksi(item.id_transaksi)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-200"
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
            <FaAngleLeft />
          </button>
          <span className="text-black">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-200 text-black rounded-lg px-4 py-2 hover:bg-gray-300 transition duration-200 flex items-center"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransaksiPage;
