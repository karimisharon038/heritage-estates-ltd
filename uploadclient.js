import React, { useState } from 'react';
import api from '../utils/api';

export default function UploadClient() {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('clientName', name);
    fd.append('notes', notes);
    if (files) for (const f of files) fd.append('files', f);
    await api.post('/clients', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
    alert('Client docs uploaded');
    setName(''); setNotes(''); setFiles(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Upload Client Documents</h3>
      <form onSubmit={submit}>
        <input placeholder="Client name" value={name} onChange={e=>setName(e.target.value)} />
        <br />
        <textarea placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
        <br />
        <input type="file" multiple onChange={e=>setFiles(e.target.files)} />
        <br />
        <button>Upload</button>
      </form>
    </div>
  );
}
