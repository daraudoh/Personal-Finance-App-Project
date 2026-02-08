import { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
  const [summary, setSummary] = useState({total: 0, byCategory: []});
  const [month, setMonth] = useState('2026-02'); //default

  const loadSummary = async() => {
    const res = await API.get(`/api/expenses/summary/month/${month}`);
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
}/*
 export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await API.get(`/auth/dashboard`);
      setSummary(res.data);
    }
    fetchData();
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Total Spent: ${summary.total.toFixed(2)}</h3>

      <h3>By Category</h3>
      <ul>
        {summary.byCategory.map((cat) => (
          <li key={cat.category} >
            {cat.category}: ${cat.total.toFixed(2)}
          </li>
        )
        
        )}
      </ul>

      <h3>Recent Expenses</h3>
      <ul>
        {summary.recent.map((exp) => (
          <li key={exp.id}>
            {exp.date} - {exp.category}: ${exp.amount}
          </li>
        )
      )}
      </ul>
    </div>
  );
 }*/
