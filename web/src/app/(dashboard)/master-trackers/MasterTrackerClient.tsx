'use client';

import React, { useState } from 'react';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { createTracker, updateTracker, deleteTracker } from '@/app/actions/trackers';

interface MasterTrackerClientProps {
  initialTrackers: any[];
}

export default function MasterTrackerClient({ initialTrackers }: MasterTrackerClientProps) {
  const [trackers, setTrackers] = useState(initialTrackers);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedTracker, setSelectedTracker] = useState<any>(null);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    order: 0,
    parentCode: '',
    actionType: '',
    moduleFlow: '',
  });

  const columns = [
    { 
      key: 'action', 
      label: 'Action', 
      render: (_: any, row: any) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: '4px 8px', fontSize: '12px' }}
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button 
            className="btn" 
            style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#FEE2E2', color: 'var(--danger)', border: '1px solid #FCA5A5' }}
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      )
    },
    { key: 'code', label: 'Code' },
    { key: 'parentCode', label: 'Parent Code' },
    { key: 'description', label: 'Description' },
    { key: 'order', label: 'Order' },
    { key: 'actionType', label: 'Action Type' },
    { key: 'moduleFlow', label: 'Module Flow' },
    { key: 'isParallel', label: 'Parallel', render: (val: any) => val ? '✔' : '✖' },
  ];

  const handleEdit = (tracker: any) => {
    setSelectedTracker(tracker);
    setFormData({
      code: tracker.code || '',
      description: tracker.description || '',
      order: tracker.order || 0,
      parentCode: tracker.parentCode || '',
      actionType: tracker.actionType || '',
      moduleFlow: tracker.moduleFlow || '',
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedTracker(null);
    setFormData({ code: '', description: '', order: 0, parentCode: '', actionType: '', moduleFlow: '' });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tracker?')) {
      const res = await deleteTracker(id);
      if (res.success) {
        setToast({ message: res.message, type: 'success' });
      } else {
        setToast({ message: res.message, type: 'error' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      ...formData,
      id: selectedTracker?.id,
      createdBy: 'System', // Hardcoded for assessment unless auth provides it
      updatedBy: 'System',
      isActive: true,
    };

    let res;
    if (modalMode === 'add') {
      res = await createTracker(payload);
    } else {
      res = await updateTracker(payload);
    }

    setIsSubmitting(false);

    if (res.success) {
      setToast({ message: res.message, type: 'success' });
      setIsModalOpen(false);
    } else {
      setToast({ message: res.message, type: 'error' });
    }
  };

  return (
    <div className="card">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '14px', color: 'var(--text-light)', marginRight: '8px' }}>Show</span>
          <select className="form-input" style={{ width: '80px', display: 'inline-block' }}>
            <option>10</option>
            <option>25</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-light)', marginRight: '8px' }}>Search:</label>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input" 
              placeholder="Search item" 
            />
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>Add Tracker</button>
        </div>
      </div>

      <DataTable columns={columns} data={trackers} />
      <Pagination currentPage={1} totalRecords={trackers.length || 50} pageSize={10} onPageChange={() => {}} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Tracker' : 'Edit Tracker'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Code</label>
            <input type="text" className="form-input" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Parent Code</label>
            <input type="text" className="form-input" value={formData.parentCode} onChange={e => setFormData({...formData, parentCode: e.target.value})} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Description</label>
            <input type="text" className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Order</label>
            <input type="number" className="form-input" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} required />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
