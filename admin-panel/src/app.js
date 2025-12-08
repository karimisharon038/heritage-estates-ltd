import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadProject from './pages/UploadProject';
import UploadClient from './pages/UploadClient';
import ManageExperience from './pages/ManageExperience';
import ChatViewer from './pages/ChatViewer';
import { setToken } from './utils/api';

const token = localStorage.getItem('token');
if (token) setToken(token);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Protected><Dashboard/></Protected>} />
        <Route path="/upload-project" element={<Protected><UploadProject/></Protected>} />
        <Route path="/upload-client" element={<Protected><UploadClient/></Protected>} />
        <Route path="/experience" element={<Protected><ManageExperience/></Protected>} />
        <Route path="/chat" element={<Protected><ChatViewer/></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}

function Protected({ children }) {
  const t = localStorage.getItem('token');
  if (!t) return <Navigate to="/login" />;
  return children;
}

export default App;
