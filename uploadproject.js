import React, { useState } from 'react';
import api from '../utils/api';

export default function UploadProject() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [files, setFiles] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', desc);
    if (files) for (const f of files) fd.append('images', f);
    const res = await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
    alert('Uploaded');
    setTitle(''); setDesc(''); setFiles(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Upload Project</h3>
      <form onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <br />
        <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <br />
        <input type="file" multiple onChange={e => setFiles(e.target.files)} />
        <br />
        <button>Upload</button>
      </form>
    </div>
  );
}
