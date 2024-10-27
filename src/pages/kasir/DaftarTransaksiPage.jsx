import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import { FaSpinner, FaAngleLeft, FaAngleRight, FaRedo } from 'react-icons/fa';
import Navbar from '../../components/manajer/navbar';
import Nota from '../../components/kasir/nota';

const DaftarTransaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtered, setFiltered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [firstFetchFailed, setFirstFetchFailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [totalTransactions, setTotalTransactions] = useState(0);
  const [completedTransactions, setCompletedTransactions] = useState(0);
  const [pendingTransactions, setPendingTransactions] = useState(0);

  const token = localStorage.getItem('token');

  const userData = token ? jwtDecode(token) : {};
  const id_user = userData.id_user;
  const nama_user = userData.username;

  const fetchAllTransaksi = async () => {
    setLoading(true);
    setError(null);
    setFirstFetchFailed(false);
    try {
      const response = await axios.get(
        `http://localhost:3000/transaksi/user/${id_user}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);

      if (response.data.status) {
        // Sort the transactions by createdAt in descending order
        const sortedTransactions = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransaksi(sortedTransactions);
        // Calculate transaction counts
        calculateTransactionCounts(sortedTransactions);
      } else {
        setFirstFetchFailed(true);
      }
    } catch (error) {
      setError('Error fetching data');
      setFirstFetchFailed(true);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate transaction counts
  const calculateTransactionCounts = (data) => {
    const total = data.length;
    const completed = data.filter((item) => item.status === 'lunas').length;
    const pending = total - completed;

    setTotalTransactions(total);
    setCompletedTransactions(completed);
    setPendingTransactions(pending);
  };

  const handleChangeStatus = async (id_transaksi, id_meja, currentStatus) => {
    const newStatus = currentStatus === 'lunas' ? 'belum_bayar' : 'lunas';

    try {
      const response = await axios.put(
        `http://localhost:3000/transaksi/status/${id_transaksi}`,
        {
          status: newStatus,
          id_meja: id_meja,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        fetchAllTransaksi();
      } else {
        alert('Gagal memperbarui status transaksi.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Terjadi kesalahan saat memperbarui status.');
    }
  };

  const fetchTransaksiByDateRange = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/transaksi/date/${startDate}/${endDate}`
      );
      if (response.data.status === 'success') {
        setTransaksi(response.data.data);
        // Recalculate transaction counts for filtered data
        calculateTransactionCounts(response.data.data);
        setFiltered(true);
        setCurrentPage(1);
        setFirstFetchFailed(false);
      } else {
        setError('No data found in the selected date range');
        setTransaksi([]);
        setFirstFetchFailed(true);
      }
    } catch (error) {
      setError('No data found');
      setFirstFetchFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    fetchAllTransaksi();
    setFiltered(false);
    setFirstFetchFailed(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAllTransaksi();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(transaksi.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = transaksi.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-white min-h-screen font-poppins">
      <Navbar />

      <div className="bg-green-800  py-20 px-20 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-white pt-6 text-2xl font-semibold">
            Transaksi {nama_user}
          </h1>
          <h1 className="text-gray-100 text-xs font-thin">
            Kasir / Daftar Transaksi
          </h1>
        </div>

        {/* Transaction Cards Section */}
        <div className="flex justify-between mt-4 text-xs space-x-4 pt-4">
          <div className="bg-white shadow-lg rounded-lg p-2 flex flex-col items-center w-36">
            <h2 className="">Total Transaksi</h2>
            <p className="text-xl text-blue-600 font-bold">
              {totalTransactions}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-2 flex flex-col items-center w-36">
            <h2 className="">Total Lunas</h2>
            <p className="text-xl text-green-600 font-bold">
              {completedTransactions}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-2 flex flex-col items-center w-36">
            <h2 className="">Total Belum Bayar</h2>
            <p className="text-xl text-red-600 font-bold">
              {pendingTransactions}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-20 font-poppins">
        {/* Filter Section */}
        <div className="flex justify-center items-center mb-6 -mt-20 bg-white p-4 rounded-lg space-x-4 text-sm shadow-md">
          <div className="flex flex-col">
            <label
              htmlFor="startDate"
              className="text-gray-700 text-xs bg-white ml-2 -mb-2 z-40 max-w-fit px-2"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="endDate"
              className="text-gray-700 text-xs bg-white ml-2 -mb-2 z-40 max-w-fit px-2"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchTransaksiByDateRange}
              className="bg-green-600 text-white rounded-lg px-6 py-2 hover:bg-green-700 transition-all duration-300 shadow"
            >
              Filter
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilter}
              className="bg-red-500 text-white rounded-lg px-6 py-2 hover:bg-red-600 transition-all duration-300 shadow"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        {loading ? (
          <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin text-green-600 text-3xl" />
            <p className="ml-2 text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : currentTransactions.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No transactions found.</p>
            {filtered && (
              <p className="text-gray-400">Please adjust the date range.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="shadow-lg rounded-lg px-4 ">
              <table className="min-w-full rounded-lg overflow-hidden">
                <thead>
                  <tr className="text-gray-800 text-center text-sm leading-normal border-b">
                    <th className="py-3 px-6  ">Tanggal Transaksi</th>
                    <th className="py-3 px-6 ">Nama Pelanggan</th>
                    <th className="py-3 px-6 ">Meja</th>
                    <th className="py-3 px-6 ">Status</th>
                    <th className="py-3 px-6 ">Total Harga</th>
                    <th className="py-3 px-6 ">Ubah Status</th>
                    <th className="py-3 px-6 ">Cetak Nota</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {currentTransactions.map((item) => (
                    <tr
                      key={item.id_transaksi}
                      className="border-b text-center border-gray-200 hover:bg-gray-100 transition duration-200"
                    >
                      <td className="py-3 px-6 ">
                        {new Date(item.tgl_transaksi).toLocaleDateString()}
                      </td>
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
                      <td className="py-3 px-6 ">
                        {item.total_harga.toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        })}
                      </td>
                      <td className="py-3 px-6 ">
                        <button
                          onClick={() =>
                            handleChangeStatus(
                              item.id_transaksi,
                              item.meja.id_meja,
                              item.status
                            )
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
                        >
                          <FaRedo />
                        </button>
                      </td>
                      <td className="py-3 px-6 ">
                        <Nota transaction={item} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center space-x-4 text-sm mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="bg-gray-200 rounded-lg px-3 py-2 hover:bg-gray-300"
                disabled={currentPage === 1}
              >
                <FaAngleLeft />
              </button>
              <span className="self-center text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="bg-gray-200 rounded-lg px-3 py-2 hover:bg-gray-300"
                disabled={currentPage === totalPages}
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaftarTransaksi;
