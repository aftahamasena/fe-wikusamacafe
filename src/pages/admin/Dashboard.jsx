import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/sidebar.jsx';
import Navbar from '../../components/admin/navbar.jsx';
import axios from 'axios';
import { FaHome, FaMoneyBill, FaMoneyBillWaveAlt, FaRegMoneyBillAlt } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Currency formatter function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    currencyDisplay: 'symbol',
  }).format(amount);
};

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [menuCount, setMenuCount] = useState(0);
  const [mejaCount, setMejaCount] = useState(0);
  const [transaksiCount, setTransaksiCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, menuResponse, mejaResponse, transaksiResponse] =
          await Promise.all([
            axios.get('http://localhost:3000/user'),
            axios.get('http://localhost:3000/menu'),
            axios.get('http://localhost:3000/meja'),
            axios.get('http://localhost:3000/transaksi'),
          ]);

        setUserCount(userResponse.data.data.length);
        setMenuCount(menuResponse.data.data.length);
        setMejaCount(mejaResponse.data.data.length);
        setTransaksiCount(transaksiResponse.data.data.length);

        // Process transactions
        const transactions = transaksiResponse.data.data;
        const revenueByDate = {};
        let todayTotal = 0;
        let overallTotal = 0;

        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 29); // Set start date to 30 days ago

        transactions.forEach((transaction) => {
          const transactionDate = new Date(transaction.tgl_transaksi);
          const date = transactionDate.toISOString().split('T')[0];
          const transactionTotal = transaction.total_harga;

          // Update today's total revenue
          if (
            transactionDate.getFullYear() === today.getFullYear() &&
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getDate() === today.getDate()
          ) {
            todayTotal += transactionTotal;
          }

          // Update overall total revenue
          overallTotal += transactionTotal;

          // Update revenue by date for the monthly chart
          if (transactionDate >= startDate && transactionDate <= today) {
            revenueByDate[date] = (revenueByDate[date] || 0) + transactionTotal;
          }
        });

        // Fill in missing dates with 0 revenue for the chart
        const revenueData = [];
        for (let i = 0; i < 30; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          const dateString = date.toISOString().split('T')[0];
          revenueData.push({
            date: dateString,
            total: revenueByDate[dateString] || 0,
          });
        }

        setMonthlyRevenue(revenueData);
        setTodayRevenue(todayTotal);
        setTotalRevenue(overallTotal);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex font-poppins">
      <Navbar />
      <Sidebar />
      <div className="flex-1 pl-72 py-24 bg-gray-50 min-h-screen">
        <div className="flex">
          <FaHome className="mt-1 text-md text-black" />
          <h1 className="text-md ml-2">Admin / Dashboard</h1>
        </div>

        {/* Card Section */}
        <div className="flex justify-left text-xs space-x-4 pt-4">
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-36 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-sm">Data User</h2>
            <p className="text-xl text-blue-700 font-bold">{userCount}</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-36 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-sm">Data Menu</h2>
            <p className="text-xl text-yellow-600 font-bold">{menuCount}</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-36 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-sm">Data Meja</h2>
            <p className="text-xl text-red-700 font-bold">{mejaCount}</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-36 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-sm">Data Transaksi</h2>
            <p className="text-xl text-green-700 font-bold">
              {transaksiCount}
            </p>
          </div>
        </div>

        <div className="flex justify-left text-xs space-x-4 pt-4">
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-72 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-sm">Pendapatan Hari Ini</h2>
            <p className="text-xl pt-2 text-green-700 font-bold">
              {formatCurrency(todayRevenue)}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-72 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-sm">Total Pendapatan</h2>
            <p className="text-xl pt-2 text-blue-700 font-bold">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="mt-4 bg-white shadow-lg rounded-lg p-4 mr-52">
          <div className="flex text-sm font-semibold pl-5">
            <FaRegMoneyBillAlt className="text-xl mr-2 text-green-700" />
            <h2 className="">Pendapatan Bulanan</h2>
          </div>
          <div className="text-xs mt-2">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1f3c9c"
                  strokeWidth={1.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
