import React, { createContext, useState } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => {
      if (!prev.some(t => t._id === transaction._id)) {
        return [...prev, transaction];
      }
      return prev;
    });
  };

  const getTransaction = (id) => {
    return transactions.find(transaction => transaction._id === id);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction._id === id ? updatedTransaction : transaction
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction._id !== id)
    );
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, getTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};
