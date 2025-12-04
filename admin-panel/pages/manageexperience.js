import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function ManageExperience(){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(()=> {
    (async ()=>{
      const res = await api.get('/experience'); if (res.data) {
        setTitle(res.data.title || '');
        setContent(res.data.content || '');
        setReviews(res.data.reviews || []);
      }
    })();
  },[]);

  async function save(e){
    e.preventDefault();
    await api.post('/experience', { title, content, reviews });
    alert('Saved');
  }

  return (<div style={{ padding:20 }}>
    <h3>Experience & Reviews</h3>
    <form onSubmit={save}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/>
      <br/>
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Long experience text"/>
      <br/>
      <button>Save</button>
    </form>

    <h4>Reviews (preview)</h4>
    {reviews.map((r,i)=> <div key={i}><b>{r.author}</b> - {r.text}</div>)}
  </div>);
}
