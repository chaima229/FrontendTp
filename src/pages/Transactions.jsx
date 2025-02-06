import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { TransactionContext } from '../transactionContexte';

const Transactions = () => {
    const { transactions, addTransaction, updateTransaction, deleteTransaction } = useContext(TransactionContext);
    const [totalAmount, setTotalAmount] = useState(0);
    const [view, setView] = useState('overview');
    const [overviewData, setOverviewData] = useState({
      allTimeProfit: 0,
      costBasis: 0,
      bestPerformer: '',
      worstPerformer: ''
    });
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const [username, setUsername] = useState('');
    const [priceChange, setPriceChange] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState({
      receiver: '',
      amount: 0
    });

    useEffect(() => {
      const fetchTransactions = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token found');
            return;
          }
          const response = await axios.get('http://localhost:3000/api/transactions', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          response.data.forEach(transaction => addTransaction(transaction));
          const total = response.data.reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
          setTotalAmount(total);
  
          // Calculer les données pour l'overview
          const allTimeProfit = total; // Exemple de calcul, à ajuster selon la logique métier
          const costBasis = total; // Exemple de calcul, à ajuster selon la logique métier
          const bestPerformer = 'Bitcoin'; // Exemple de valeur, à ajuster selon la logique métier
          const worstPerformer = 'Ethereum'; // Exemple de valeur, à ajuster selon la logique métier
  
          setOverviewData({
            allTimeProfit,
            costBasis,
            bestPerformer,
            worstPerformer
          });

          // Calculer le changement de prix
          const priceChange = total - costBasis; // Exemple de calcul, à ajuster selon la logique métier
          setPriceChange(priceChange);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };

      const fetchCryptocurrencies = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/cryptocurrency');
          setCryptocurrencies(response.data.data);
        } catch (error) {
          console.error('Error fetching cryptocurrencies:', error);
        }
      };

      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token found');
            return;
          }
          const response = await axios.get('http://localhost:3000/auth/users', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUsername(response.data.username);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
  
      fetchTransactions();
      fetchCryptocurrencies();
      fetchUser();
    }, [addTransaction]);

    const getCryptoLogo = (cryptoName) => {
      const crypto = cryptocurrencies.find(c => c.name === cryptoName);
      return crypto ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png` : '';
    };

    const handleDelete = async (transactionId) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        await axios.delete(`http://localhost:3000/api/transactions/${transactionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        deleteTransaction(transactionId);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    };
  
    const handleEdit = (transaction) => {
      setCurrentTransaction(transaction);
      setIsModalOpen(true);
    };

    const handleSave = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        await axios.put(`http://localhost:3000/api/transactions/${currentTransaction._id}`, currentTransaction, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        updateTransaction(currentTransaction._id, currentTransaction);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error updating transaction:', error);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setCurrentTransaction({ ...currentTransaction, [name]: value });
    };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-slate-800 p-4 rounded flex items-center justify-start w-full">
              <div className="text-start">
                <h2 className="text-xl font-bold">{username}</h2>
                
                <h2 className="text-xl font-bold mt-4">Total Amount</h2>
                <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                <p className={`text-lg ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange >= 0 ? `+${priceChange.toFixed(2)}` : `${priceChange.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <button
              className={`px-4 py-2 ${view === 'overview' ? 'bg-indigo-600' : 'bg-gray-600'} text-white rounded`}
              onClick={() => setView('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 ${view === 'transactions' ? 'bg-indigo-600' : 'bg-gray-600'} text-white rounded`}
              onClick={() => setView('transactions')}
            >
              Transactions
            </button>
          </div>
          {view === 'overview' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-4 rounded">
                  <h2 className="text-xl font-bold">All-time Profit</h2>
                  <p>${overviewData.allTimeProfit.toFixed(2)}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded">
                  <h2 className="text-xl font-bold">Cost Basis</h2>
                  <p>${overviewData.costBasis.toFixed(2)}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded flex items-center">
                  <img src={getCryptoLogo(overviewData.bestPerformer)} alt={overviewData.bestPerformer} className="w-8 h-8 mr-2" />
                  <div>
                    <h2 className="text-xl font-bold">Best Performer</h2>
                    <p>{overviewData.bestPerformer}</p>
                  </div>
                </div>
                <div className="bg-slate-800 p-4 rounded flex items-center">
                  <img src={getCryptoLogo(overviewData.worstPerformer)} alt={overviewData.worstPerformer} className="w-8 h-8 mr-2" />
                  <div>
                    <h2 className="text-xl font-bold">Worst Performer</h2>
                    <p>{overviewData.worstPerformer}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-xl mb-4">Total Amount: ${totalAmount.toFixed(2)}</h2>
              <div className="overflow-x-auto">
                <table className="table-auto min-w-full bg-slate-800 text-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Logo</th>
                      <th className="py-2 px-4 border-b text-left">Transaction ID</th>
                      <th className="py-2 px-4 border-b text-left">Receiver</th>
                      <th className="py-2 px-4 border-b text-left">Amount</th>
                      <th className="py-2 px-4 border-b text-left">Date</th>
                      <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr key={transaction._id}>
                          <td className="py-2 px-4 border-b">
                            <img src={getCryptoLogo(transaction.receiver)} alt={transaction.receiver} className="w-8 h-8" />
                          </td>
                          <td className="py-2 px-4 border-b">{transaction._id}</td>
                          <td className="py-2 px-4 border-b">{transaction.receiver}</td>
                          <td className="py-2 px-4 border-b">${transaction.amount}</td>
                          <td className="py-2 px-4 border-b">{transaction.timestamp}</td>
                          <td className="py-2 px-4 border-b">
                            <button onClick={() => handleEdit(transaction)} className="text-blue-500 hover:text-blue-700 mr-2">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button onClick={() => handleDelete(transaction._id)} className="text-red-500 hover:text-red-700">
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-2 px-4 text-center">No transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-4 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
            <label className="block mb-2">
              Cryptocurrency:
              <select
                name="receiver"
                value={currentTransaction.receiver}
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded bg-black"
              >
                {cryptocurrencies.map((crypto) => (
                  <option key={crypto.id} value={crypto.name}>
                    {crypto.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block mb-2 ">
              Amount:
              <input
                type="number"
                name="amount"
                value={currentTransaction.amount}
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded bg-black"
              />
            </label>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
