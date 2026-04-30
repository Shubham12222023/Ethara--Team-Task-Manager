import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { Plus, Trash2 } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/projects`, { name, description });
      setShowModal(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1>Projects</h1>
        {user.role === 'Admin' && (
          <button className="btn" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      <div className="grid">
        {projects.map(project => (
          <div key={project.id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{project.name}</h3>
              {user.role === 'Admin' && (
                <button className="btn-outline" style={{ padding: '0.25rem' }} onClick={() => deleteProject(project.id)}>
                  <Trash2 size={16} color="var(--danger)" />
                </button>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', minHeight: '3rem' }}>
              {project.description || 'No description'}
            </p>
            <div style={{ borderTop: 'var(--glass-border)', paddingTop: '1rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--primary)' }}>Tasks: {project.Tasks?.length || 0}</span>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p>No projects available.</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
            <h2>Create Project</h2>
            <form onSubmit={createProject}>
              <div className="input-group">
                <label>Name</label>
                <input type="text" required className="input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn" style={{ flex: 1 }}>Create</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
