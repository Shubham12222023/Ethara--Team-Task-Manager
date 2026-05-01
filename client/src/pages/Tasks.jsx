import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', description: '', status: 'Pending', dueDate: '', projectId: '', assignedTo: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTasks();
    if (user.role === 'Admin') {
      fetchProjectsAndUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      const userTasks = user.role === 'Admin' ? res.data : res.data.filter(t => t.assignedTo === user.id);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const fetchProjectsAndUsers = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/auth/users`)
      ]);
      setProjects(projRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching dependencies', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, assignedTo: formData.assignedTo || null };
      if (formData.id) {
        await axios.put(`${API_URL}/tasks/${formData.id}`, payload);
      } else {
        await axios.post(`${API_URL}/tasks`, payload);
      }
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task', error);
      alert(error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || error.message || 'Error saving task');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        projectId: task.projectId || '',
        assignedTo: task.assignedTo || ''
      });
    } else {
      setFormData({ id: null, title: '', description: '', status: 'Pending', dueDate: '', projectId: '', assignedTo: '' });
    }
    setShowModal(true);
  };

  return (
    <div>
      <div className="navbar">
        <h1>Tasks</h1>
        {user.role === 'Admin' && (
          <button className="btn" onClick={() => openModal()}>
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '1rem', border: 'var(--glass-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: 'var(--glass-border)' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Project</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Due Date</th>
              <th style={{ padding: '1rem' }}>Assignee</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={{ borderBottom: 'var(--glass-border)' }}>
                <td style={{ padding: '1rem' }}>{task.title}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{task.Project?.name}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge badge-${task.status.replace(' ', '')}`}>{task.status}</span>
                </td>
                <td style={{ padding: '1rem' }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '1rem' }}>{task.Assignee?.name || 'Unassigned'}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-outline" style={{ padding: '0.25rem' }} onClick={() => openModal(task)}>
                    <Edit2 size={16} color="var(--text-main)" />
                  </button>
                  {user.role === 'Admin' && (
                    <button className="btn-outline" style={{ padding: '0.25rem' }} onClick={() => deleteTask(task.id)}>
                      <Trash2 size={16} color="var(--danger)" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && <p style={{ padding: '2rem', textAlign: 'center' }}>No tasks found.</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
            <h2>{formData.id ? 'Edit Task' : 'Create Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input type="text" required className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} />
              </div>
              
              {user.role === 'Admin' && !formData.id && (
                <div className="input-group">
                  <label>Project</label>
                  <select required className="input" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} style={{ background: '#1e293b' }}>
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}

              <div className="input-group">
                <label>Status</label>
                <select className="input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ background: '#1e293b' }}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="input-group">
                <label>Due Date</label>
                <input type="date" className="input" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
              </div>

              {user.role === 'Admin' && (
                <div className="input-group">
                  <label>Assignee</label>
                  <select className="input" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} style={{ background: '#1e293b' }}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
