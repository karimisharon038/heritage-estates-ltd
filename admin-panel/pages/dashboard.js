import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    reviews: 0,
    messages: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const proj = await api.get('/projects');
      const clients = await api.get('/clients');
      const exp = await api.get('/experience');
      const chat = await api.get('/chat');

      setStats({
        projects: proj.data.length,
        clients: clients.data.length,
        reviews: exp.data?.reviews?.length || 0,
        messages: chat.data.length
      });
    } catch (err) {
      console.error("Stats load error:", err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome back, Admin.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        
        <div style={boxStyle}>
          <h3>{stats.projects}</h3>
          <p>Projects Uploaded</p>
          <Link to="/upload-project">Manage</Link>
        </div>

        <div style={boxStyle}>
          <h3>{stats.clients}</h3>
          <p>Client Documents</p>
          <Link to="/upload-client">Manage</Link>
        </div>

        <div style={boxStyle}>
          <h3>{stats.reviews}</h3>
          <p>Reviews</p>
          <Link to="/experience">Manage</Link>
        </div>

        <div style={boxStyle}>
          <h3>{stats.messages}</h3>
          <p>Chat Messages</p>
          <Link to="/chat">View</Link>
        </div>
      </div>

      <br /><br />
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        style={{
          background: '#b30000',
          padding: '10px 15px',
          border: 'none',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}

const boxStyle = {
  padding: '20px',
  textAlign: 'center',
  background: '#f4f4f4',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
};
