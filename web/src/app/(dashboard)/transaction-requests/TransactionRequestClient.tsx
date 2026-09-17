'use client';

import React, { useState } from 'react';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { createRequest, updateRequest, deleteRequest } from '@/app/actions/requests';
import { Search } from 'lucide-react';

interface TransactionRequestClientProps {
  initialRequests: any[];
}

export default function TransactionRequestClient({ initialRequests }: TransactionRequestClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states based on API structure in Postman
  const [formData, setFormData] = useState({
    partnerId: '',
    projectCode: '',
    totalFee: 0,
    lastStatus: '',
    receivingStatus: '',
    leadTime: 0,
    receivedDate: '',
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
    { key: 'projectCode', label: 'Project Code' },
    { key: 'totalFee', label: 'Total Fee', render: (val: any) => `$${Number(val).toFixed(2)}` },
    { key: 'lastStatus', label: 'Status' },
    { key: 'receivingStatus', label: 'Receiving Status' },
    { key: 'leadTime', label: 'Lead Time' },
    { key: 'receivedDate', label: 'Received Date', render: (val: any) => val ? new Date(val).toLocaleDateString() : '-' },
  ];

  const handleEdit = (req: any) => {
    setSelectedRequest(req);
    setFormData({
      partnerId: req.partnerId || '',
      projectCode: req.projectCode || '',
      totalFee: req.totalFee || 0,
      lastStatus: req.lastStatus || '',
      receivingStatus: req.receivingStatus || '',
      leadTime: req.leadTime || 0,
      receivedDate: req.receivedDate ? req.receivedDate.split('T')[0] : '', // format for date input
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedRequest(null);
    setFormData({ partnerId: '', projectCode: '', totalFee: 0, lastStatus: '', receivingStatus: '', leadTime: 0, receivedDate: '' });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      const res = await deleteRequest(id);
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
    
    // Ensure partnerId is valid UUID structure if not provided, just mock for UI.
    const payload = {
      ...formData,
      partnerId: formData.partnerId || 'urn:uuid:d9568011-9afe-7002-aa31-83001c8be297',
      receivedDate: formData.receivedDate ? new Date(formData.receivedDate).toISOString() : new Date().toISOString(),
      id: selectedTracker?.id,
      createdBy: 'System', 
      updatedBy: 'System',
      isActive: true,
    };

    let res;
    if (modalMode === 'add') {
      res = await createRequest(payload);
    } else {
      res = await updateRequest(payload);
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
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input" 
                placeholder="Search..." 
                style={{ paddingRight: '32px' }}
              />
              <Search size={16} color="var(--text-light)" style={{ position: 'absolute', right: '10px', top: '12px' }} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>Add Request</button>
        </div>
      </div>

      <DataTable columns={columns} data={requests} />
      <Pagination currentPage={1} totalRecords={requests.length || 50} pageSize={10} onPageChange={() => {}} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Request' : 'Edit Request'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Project Code</label>
            <input type="text" className="form-input" value={formData.projectCode} onChange={e => setFormData({...formData, projectCode: e.target.value})} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Total Fee</label>
              <input type="number" step="0.01" className="form-input" value={formData.totalFee} onChange={e => setFormData({...formData, totalFee: parseFloat(e.target.value)})} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Lead Time (days)</label>
              <input type="number" className="form-input" value={formData.leadTime} onChange={e => setFormData({...formData, leadTime: parseInt(e.target.value)})} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Status</label>
              <input type="text" className="form-input" value={formData.lastStatus} onChange={e => setFormData({...formData, lastStatus: e.target.value})} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Receiving Status</label>
              <input type="text" className="form-input" value={formData.receivingStatus} onChange={e => setFormData({...formData, receivingStatus: e.target.value})} required />
            </div>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Received Date</label>
            <input type="date" className="form-input" value={formData.receivedDate} onChange={e => setFormData({...formData, receivedDate: e.target.value})} required />
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
