import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tasks`);
        const userTasks = user.role === 'Admin' ? res.data : res.data.filter(t => t.assignedTo === user.id);
        setTasks(userTasks);

        const now = new Date();
        const statsObj = {
          total: userTasks.length,
          pending: userTasks.filter(t => t.status === 'Pending').length,
          inProgress: userTasks.filter(t => t.status === 'In Progress').length,
          completed: userTasks.filter(t => t.status === 'Completed').length,
          overdue: userTasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed').length
        };
        setStats(statsObj);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };
    fetchTasks();
  }, [user]);

  return (
    <div>
      <div className="navbar">
        <h1>Dashboard</h1>
      </div>
      
      <div className="dashboard-stats">
        <div className="glass-card stat-card">
          <div className="stat-value" style={{ color: 'var(--primary)' }}>{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-value" style={{ color: '#fbbf24' }}>{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-value" style={{ color: '#60a5fa' }}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-value" style={{ color: '#4ade80' }}>{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      <h2>Recent Tasks</h2>
      <div className="grid">
        {tasks.slice(0, 6).map(task => (
          <div key={task.id} className="glass-card">
            <h3>{task.title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Project: {task.Project?.name}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge badge-${task.status.replace(' ', '')}`}>{task.status}</span>
              {task.dueDate && <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p>No tasks found.</p>}
      </div>
    </div>
  );
}
