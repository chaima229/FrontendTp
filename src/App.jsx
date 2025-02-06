import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import { AuthProvider } from "./AuthProvider";
import { TransactionProvider } from "./transactionContexte"; // Assurez-vous d'avoir ce fichier

const App = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={isAuthenticated ? <Home /> : <Navigate to="/" />}
            />
            <Route
              path="/transactions"
              element={isAuthenticated ? <Transactions /> : <Navigate to="/" />}
            />
          </Routes>
          <ToastContainer />
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
};

export default App;
