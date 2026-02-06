import { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
  const [summary, setSummary] = useState({total: 0, byCategory: []});
  const [month, setMonth] = useState('2026-02'); //default

  const loadSummary = async() => {
    const res = await API.get('/expenses/summary/month/${month}');
    setSummary(res.data);
  }

  useEffect(() => {
    loadSummary();
  }, [month]);


  return (
    <div>
      <h2>Dashboard</h2>
      <input
        type="month"
        value={month}
        onChange={e => setMonth(e.target.value)}
        />
      <p>Total spending: ${summary.total}</p>  
      <h3>By category</h3>
      <ul>
        {summary.byCategory.map(c => (
          <li key={c.category}>{c.category}: ${c.total}</li>
        ))}
      </ul>
    </div>
  
  );
}