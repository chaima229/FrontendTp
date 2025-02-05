import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';

const Home = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [transactionType, setTransactionType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [pricePerCoin, setPricePerCoin] = useState('');
  const [total, setTotal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cryptosPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCryptocurrencies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cryptocurrency');
        setCryptocurrencies(response.data.data);
      } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
      }
    };

    fetchCryptocurrencies();
  }, []);

  const handleTransactionClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowTransactionModal(false);
    setSelectedCrypto(null);
    setTransactionType('buy');
    setAmount('');
    setPricePerCoin('');
    setTotal('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
    setPricePerCoin(crypto.quote.USD.price.toFixed(2));
    setShowTransactionModal(true);
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setTotal((value * pricePerCoin).toFixed(2));
  };

  const handleCryptoChange = (e) => {
    const selectedId = e.target.value;
    const crypto = cryptocurrencies.find((crypto) => crypto.id === selectedId);
    setSelectedCrypto(crypto);
    setPricePerCoin(crypto.quote.USD.price.toFixed(2));
    setAmount('');
    setTotal('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
          console.error('No token found');
          return;
      }
        console.log('Token:', token);
        const transactionData = {
            receiver: selectedCrypto.name,
            amount,
        };
        console.log('Token envoyé dans la requête:', token);
        const response = await axios.post('http://localhost:3000/api/transactions', transactionData, {
          headers: {
              'Authorization': `Bearer ${token}` // Assurez-vous que le token est correctement formaté
          }
          
      });
      
        console.log('Transaction saved:', response.data);
        toast.success('Transaction created successfully');
        navigate('/transactions'); // Redirection vers la page des transactions après une création réussie
    } catch (error) {
        console.error('Error saving transaction:', error);
        toast.error('Failed to create transaction');
    }
    handleCloseModal();
  };

  const filteredCryptocurrencies = cryptocurrencies.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCrypto = currentPage * cryptosPerPage;
  const indexOfFirstCrypto = indexOfLastCrypto - cryptosPerPage;
  const currentCryptos = filteredCryptocurrencies.slice(indexOfFirstCrypto, indexOfLastCrypto);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Cryptocurrencies</h1>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 bg-[#0D1421] text-white"
              />
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={handleTransactionClick}
              >
                Make a Transaction
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto min-w-full bg-slate-800 text-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Logo</th>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Symbol</th>
                  <th className="py-2 px-4 border-b text-left">Price</th>
                  <th className="py-2 px-4 border-b text-left">Market Cap</th>
                  <th className="py-2 px-4 border-b text-left">24h Volume</th>
                  <th className="py-2 px-4 border-b text-left">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {currentCryptos.length > 0 ? (
                  currentCryptos.map((crypto) => (
                    <tr key={crypto.id} onClick={() => handleCryptoSelect(crypto)} className="cursor-pointer">
                      <td className="py-2 px-4 border-b text-left">
                        <img src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`} alt={crypto.name} className="w-8 h-8" />
                      </td>
                      <td className="py-2 px-4 border-b text-left">{crypto.name}</td>
                      <td className="py-2 px-4 border-b text-left">{crypto.symbol}</td>
                      <td className="py-2 px-4 border-b text-left">${crypto.quote.USD.price.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b text-left">${crypto.quote.USD.market_cap.toLocaleString()}</td>
                      <td className="py-2 px-4 border-b text-left">${crypto.quote.USD.volume_24h.toLocaleString()}</td>
                      <td className={`py-2 px-4 border-b text-left ${crypto.quote.USD.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-2 px-4 text-center">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <nav>
              <ul className="flex space-x-2">
                {Array.from({ length: Math.ceil(filteredCryptocurrencies.length / cryptosPerPage) }, (_, i) => (
                  <li key={i} className="cursor-pointer px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600" onClick={() => paginate(i + 1)}>
                    {i + 1}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {showModal && (
            <Modal onClose={handleCloseModal}>
              <h2 className="text-xl font-bold mb-4">Select a Cryptocurrency</h2>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 bg-[#0D1421] text-white"
              />
              <ul className="max-h-60 overflow-y-auto scrollbar-hide snap-y snap-mandatory">
                {filteredCryptocurrencies.map((crypto) => (
                  <li key={crypto.id} className="mb-2 hover:bg-gray-700 p-2 rounded snap-start" onClick={() => handleCryptoSelect(crypto)}>
                    <span className="font-bold">{crypto.name}</span> ({crypto.symbol}): ${crypto.quote.USD.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </Modal>
          )}
          {showTransactionModal && (
            <Modal onClose={handleCloseModal}>
              <div className="flex justify-between items-center mr-4 mb-4">
                <button
                  className={`px-7 py-2 ${transactionType === 'buy' ? 'bg-indigo-600' : 'bg-gray-600'} text-white rounded hover:bg-indigo-700`}
                  onClick={() => handleTransactionTypeChange('buy')}
                >
                  Buy
                </button>
                <button
                  className={`px-7 py-2 ${transactionType === 'sell' ? 'bg-indigo-600' : 'bg-gray-600'} text-white rounded hover:bg-indigo-700`}
                  onClick={() => handleTransactionTypeChange('sell')}
                >
                  Sell
                </button>
                <button
                  className={`px-7 py-2 ${transactionType === 'transfer' ? 'bg-indigo-600' : 'bg-gray-600'} text-white rounded hover:bg-indigo-700`}
                  onClick={() => handleTransactionTypeChange('transfer')}
                >
                  Transfer
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300">Cryptocurrency</label>
                  <select
                    value={selectedCrypto?.id || ''}
                    onChange={handleCryptoChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 bg-[#0D1421] text-white"
                  >
                    {cryptocurrencies.map((crypto) => (
                      <option key={crypto.id} value={crypto.id}>
                        {crypto.name} ({crypto.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 bg-[#0D1421] text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300">Price per Coin</label>
                  <input
                    type="text"
                    value={pricePerCoin}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 bg-[#0D1421] text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300">Total</label>
                  <input
                    type="text"
                    value={total}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 bg-[#0D1421] text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add Transaction
                </button>
              </form>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

