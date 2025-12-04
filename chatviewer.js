import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function ChatViewer(){
  const [messages, setMessages] = useState([]);
  useEffect(()=> {
    (async ()=> {
      const res = await api.get('/chat');
      setMessages(res.data || []);
    })();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Chat Messages</h3>
      {messages.map(m => (
        <div key={m._id} style={{ borderBottom: '1px solid #ddd', padding: 10 }}>
          <b>{m.name}</b> ({m.email}) <br />
          <small>{new Date(m.createdAt).toLocaleString()}</small>
          <p>{m.message}</p>
        </div>
      ))}
    </div>
  );
}
