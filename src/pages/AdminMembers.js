import React, { useEffect, useState } from 'react';
import { getMembers, addMember, deleteMember } from '../service/memberService';
import { getFlats } from '../service/flatService'; // fetch available flats
import { useNavigate } from 'react-router-dom';
import './AdminMembers.css';

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [flats, setFlats] = useState([]);
  const [newMember, setNewMember] = useState({ firstName: '', flatId: '', email: '', phone: '', password: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    loadMembers();
    loadFlats();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await getMembers();
      const membersWithId = data.map(m => ({
        ...m,
        id: m._id || m.id,
        phone: m.phone || 'N/A',
        name: m.firstName,
        flatNo: m.flatId ? `${m.flatId}` : 'Not Assigned'
      }));
      setMembers(membersWithId);
    } catch (err) {
      console.error('Error loading members:', err);
    }
  };

  const loadFlats = async () => {
    try {
      const data = await getFlats();
      const availableFlats = data.filter(f => f.status !== 'OCCUPIED'); // only vacant or under renovation
      setFlats(availableFlats);
    } catch (err) {
      console.error('Error loading flats:', err);
    }
  };

  const handleAdd = async () => {
    
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      await deleteMember(id);
      loadMembers();
      loadFlats(); // refresh flats
    }
  };

  const handleRowClick = (id) => {
    setSelectedMemberId(selectedMemberId === id ? null : id);
  };

  return (
    <div className="admin-members-container">
      <h1>👥 Member Management</h1>

      <div className="top-bar">
        <p>Manage all society members here.</p>
        <button className="btn btn-blue" onClick={() => navigate(`/admin/addmember`)}>
          {showAddForm ? 'Close' : '+ Add Member'}
        </button>
      </div>

      <table className="members-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Flat</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? members.map((m, i) => (
            <React.Fragment key={m.id || i}>
              <tr onClick={() => handleRowClick(m.id)} className="member-row">
                <td>{i + 1}</td>
                <td>{m.name}</td>
                <td>{m.flatNo}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
              </tr>

              {selectedMemberId === m.id && (
                <tr className="action-row">
                  <td colSpan="5">
                    <div className="action-buttons">
                      <button className="btn btn-green" onClick={() => alert('Edit functionality pending')}>Edit</button>
                      <button className="btn btn-red" onClick={() => handleDelete(m.id)}>Delete</button>
                      <button className="btn btn-cyan" onClick={() => navigate(`/admin/member/${m.id}`)}>Details</button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          )) : (
            <tr>
              <td colSpan="5" className="no-members">No members found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
