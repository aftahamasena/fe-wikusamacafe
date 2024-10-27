import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTrashAlt,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Cart = ({ cartItems, removeFromCart }) => {
  const [customerName, setCustomerName] = React.useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userData = jwtDecode(token);
  const id_user = userData.id_user;
  const nama_user = userData.nama_user;

  const getTotalPrice = () => {
    const total = cartItems.reduce(
      (total, item) => total + item.harga * item.qty,
      0
    );
    // Save total price to localStorage
    localStorage.setItem('total_harga', total);
    return total.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  // Function to get total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  };

  const handleCheckout = async () => {
    const total_harga = localStorage.getItem('total_harga');
    const detail_transaksi = cartItems.map((item) => ({
      id_menu: item.id_menu,
      harga: item.harga,
      qty: item.qty,
    }));

    const transaksiData = {
      id_user: parseInt(id_user),
      nama_pelanggan: customerName,
      total_harga: parseInt(total_harga),
      detail_transaksi,
    };

    try {
      // Make the POST request to the API
      const response = await axios.post(
        'http://localhost:3000/transaksi',
        transaksiData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Transaction successful:', response.data);
      alert('Transaction successful!');
      setCustomerName('');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('total_harga');
      window.location.reload();
    } catch (error) {
      console.error('Error during transaction:', error);
      alert('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="w-[400px] h-screen bg-white shadow-xl p-6 fixed right-0 font-poppins">
      <div className="flex justify-end items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-400">{nama_user}</h1>
        <img
          src="https://jacoblund.com/cdn/shop/products/photo-id-4670656348229-young-supermarket-cashier.jpg?v=1612432428"
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>

      <hr className="my-4 border-1 border-gray-400" />

      <div className="flex justify-between mb-4">
        <span className="text-lg font-semibold">Shopping Cart</span>
        <span
          className={`text-lg font-semibold pr-6 ${getTotalItems() === 0 ? 'text-red-600' : 'text-green-600'}`}
        >
          {getTotalItems()} Item
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center text-red-500 text-sm my-8">
          Pesanan belum tersedia
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 font-semibold text-xs">
            <span>Nama Menu</span>
            <span className="text-center">Quantity</span>
            <span className="text-center">Harga</span>
            <span className="text-center">Action</span>
          </div>

          <div className="mt-4 max-h-[200px] overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id_menu} className="grid grid-cols-4 py-2 text-xs">
                <span>{item.nama_menu}</span>
                <span className="text-center">{item.qty}</span>
                <span className="text-center text-green-600">
                  {item.harga.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </span>
                <button
                  className="text-red-500 flex justify-center hover:text-yellow-500 transition-all duration-200"
                  onClick={() => removeFromCart(item.id_menu)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            ))}
          </div>

          <hr className="my-4 border-1 border-green-600" />

          <div className="flex justify-between">
            <span className="text-lg font-bold mb-4 text-left">Total</span>
            <h3 className="text-lg font-bold text-right text-green-600">
              {getTotalPrice()}
            </h3>
          </div>

          <div className="flex flex-col mb-4">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border rounded-xl p-3 text-sm border-green-700 focus:border-green-500 focus:outline-none transition duration-200"
              placeholder="Masukkan nama pelanggan"
            />
          </div>

          <button
            className="w-full bg-green-600 text-white rounded-lg text-sm py-4 flex items-center justify-center gap-2 hover:bg-green-700 transition-all duration-300"
            onClick={handleCheckout}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
            Checkout
          </button>
        </>
      )}

      <div className="absolute bottom-5 right-5 w-[355px]">
        <button
          onClick={() => navigate('/kasir/daftar-transaksi')}
          className="w-full bg-white border border-green-600 text-green-600 cursor-pointer flex items-center justify-center bg-cover bg-center rounded-lg p-3 transition-all h-11 hover:bg-green-600 hover:text-white"
        >
          <FontAwesomeIcon icon={faList} className="text-md mr-2" />
          <span className="text-sm">Daftar Transaksi</span>
        </button>
      </div>
    </div>
  );
};

export default Cart;
