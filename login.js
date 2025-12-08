import React, { useState } from 'react';
import api, { setToken } from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function submit(e) {
    e.preventDefault();
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      window.location.href = '/';
    } else alert('Login failed');
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}
