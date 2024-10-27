import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/kasir/sidebar';
import Cart from '../../components/kasir/cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // Imported icons

const KasirPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMenu();
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [filter, searchQuery]);

  const fetchMenu = async () => {
    try {
      const response = await axios.get('http://localhost:3000/menu');
      let items = response.data.data;

      if (filter !== 'all') {
        items = items.filter((item) => item.jenis === filter);
      }

      if (searchQuery) {
        items = items.filter((item) =>
          item.nama_menu.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu:', error.message);
    }
  };

  const addToCart = (menuItem, qty) => {
    const existingItem = cartItems.find(
      (item) => item.id_menu === menuItem.id_menu
    );
    let updatedCart;

    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        qty: existingItem.qty + qty,
      };
      updatedCart = cartItems.map((item) =>
        item.id_menu === menuItem.id_menu ? updatedItem : item
      );
    } else {
      updatedCart = [...cartItems, { ...menuItem, qty }];
    }

    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id_menu !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  return (
    <div className="font-poppins flex min-h-screen bg-gray-50">
      <Sidebar setFilter={setFilter} />
      <div className="flex-1 p-6">
        <div className="flex items-center mb-4 ml-60 mr-96 px-4">
          <h1 className="text-2xl font-bold flex-grow">Menu List</h1>
          <div className="flex items-center border rounded-3xl p-3 bg-white">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-400 text-xs"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs border-none outline-none bg-transparent px-2 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-60 mr-96 px-4">
          {menuItems.map((menuItem) => (
            <MenuItemCard
              key={menuItem.id_menu}
              menuItem={menuItem}
              addToCart={addToCart}
            />
          ))}
        </div>
      </div>
      <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
    </div>
  );
};

const MenuItemCard = ({ menuItem, addToCart }) => {
  const [qty, setQty] = useState(1);

  const limitDescription = (description) => {
    return description.length > 50
      ? `${description.slice(0, 50)}...`
      : description;
  };

  return (
    <div className="flex flex-col border p-4 rounded-lg shadow-sm bg-white h-full">
      <div className="flex-1 mb-4">
        <img
          src={`http://localhost:3000/images/${menuItem.gambar}`}
          alt={menuItem.nama_menu}
          className="h-36 w-full object-cover rounded-lg mb-2"
        />
        <h3 className="text-lg font-bold">{menuItem.nama_menu}</h3>
        <p className="text-gray-600 text-xs mb-1">
          {limitDescription(menuItem.deskripsi)}
        </p>
        <p className="text-sm font-bold text-green-600">
          {menuItem.harga.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
          })}
        </p>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          <button
            className="bg-white text-black rounded-full border-gray-400 border-2 w-8 h-8 hover:bg-green-700 hover:text-white hover:border-green-700 transition-all duration-200"
            onClick={() => setQty((prev) => Math.max(prev - 1, 1))}
          >
            -
          </button>
          <span className="px-2">{qty}</span>
          <button
            className="bg-white text-black rounded-full border-gray-400 border-2 w-8 h-8 hover:bg-green-700 hover:text-white hover:border-green-700 transition-all duration-200"
            onClick={() => setQty((prev) => prev + 1)}
          >
            +
          </button>
        </div>
        <button
          className="text-xs py-2 px-2 bg-green-700 hover:bg-green-600 text-white rounded-lg flex items-center transition-all duration-200"
          onClick={() => addToCart(menuItem, qty)}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default KasirPage;
