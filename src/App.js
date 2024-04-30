// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import WelcomePage from './components/WelcomePage';
import AdminPage from './components/AdminPage';
import ProducerPage from './components/ProducerPage';
import ProducerRegistrationPage from './components/ProducerRegistrationPage';
import AdminDashboard from './components/AdminDashboard';
import ProducerDashboard from './components/ProducerDashboard';
import DeleteProducerPage from './components/DeleteProducerPage';
import ProducersListPage from './components/ProducersListPage';
import PrivateRoute from './components/PrivateRoute';
import ViewProductsPage from './components/ViewProductsPage';
import WithdrawProductsPage from './components/WithdrawProductsPage';
import NewProductPage from './components/NewProductPage'; 
import InsertNFCPage from './components/InsertNFCPage'; 
import ViewNFCTokensPage from './components/ViewNFCTokensPage';  
import UploadNFCKeysPage from './components/UploadNFCKeysPage';
import ViewAssignedKeysPage from './components/ViewAssignedKeysPage';
import AvailableKeysPage from './components/AvailableKeysPage';
import ProducerLogin from './components/ProducerLogin'; 
import UploadDigitalSignaturesPage from './components/UploadDigitalSignaturesPage';
import ViewDigitalSignaturesPage from './components/ViewDigitalSignaturesPage';
import RemoveDigitalSignaturesPage from './components/RemoveDigitalSignaturesPage';
import AddMultipleProducts from './components/AddMultipleProducts';
import MerkleRoot from './components/MerkleRoot';
import ViewRetiredKeys from './components/ViewRetiredKeysPage'; 
import WithdrawNFCPage from './components/WithdrawNFCPage';

function App() {
  const [availableKeys, setAvailableKeys] = useState([]);

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/admin-login" element={<AdminPage />} />
          <Route path="/producer-login" element={<ProducerLogin />} />  // Correct route for producer login
          <Route path="/producer-register" element={<ProducerRegistrationPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/producer-dashboard" element={<ProducerDashboard />} />
          <Route path="/delete-producer" element={<DeleteProducerPage />} />
          <Route path="/producers-list" element={<ProducersListPage />} />
		  <Route path="/new-products" element={<NewProductPage />} />
		  <Route path="/view-products" element={<ViewProductsPage />} />
		  <Route path="/withdraw-products" element={<WithdrawProductsPage />} />
          <Route path="/insert-nfc" element={<PrivateRoute><InsertNFCPage /></PrivateRoute>} />
          <Route path="/view-nfc-tokens" element={<PrivateRoute><ViewNFCTokensPage /></PrivateRoute>} />
          <Route path="/withdraw-nfc" element={<WithdrawNFCPage />} />
          <Route path="/upload-nfc-keys" element={<UploadNFCKeysPage />} />
          <Route path="/view-assigned-keys" element={<ViewAssignedKeysPage />} />
          <Route path="/available-keys" element={<AvailableKeysPage keys={availableKeys} />} />
          <Route path="/upload-digital-signatures" element={<UploadDigitalSignaturesPage />} />
          <Route path="/view-digital-signatures" element={<ViewDigitalSignaturesPage />} />
          <Route path="/remove-digital-signatures" element={<RemoveDigitalSignaturesPage />} />
		  <Route path="/create-single-product" element={<NewProductPage />} />
		  <Route path="/create-multiple-products" element={<AddMultipleProducts />} />
		  <Route path="/create-merkle-root" element={<MerkleRoot />} />
		  <Route path="/view-retires-keys" element={<ViewRetiredKeys />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
