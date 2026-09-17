import React from 'react';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { fetchKalbeApi, buildPaginationHeaders } from '@/lib/api';
import Link from 'next/link';

export default async function MasterTrackersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';
  const limit = 10;

  let trackers = [];
  let error = null;

  try {
    const headers = buildPaginationHeaders(page, limit, search, 'order', 'ASC');
    const res = await fetchKalbeApi('/trackers/paging', { headers });
    
    if (res.ok) {
      trackers = await res.json();
    } else {
      const errData = await res.json().catch(() => ({}));
      error = errData.message || 'Failed to fetch trackers';
    }
  } catch (e: any) {
    error = e.message || 'An error occurred';
  }

  const columns = [
    { key: 'action', label: 'Action', render: () => '...' },
    { key: 'code', label: 'Code' },
    { key: 'parentCode', label: 'Parent Code' },
    { key: 'description', label: 'Description' },
    { key: 'order', label: 'Order' },
    { key: 'icon', label: 'Icon' },
    { key: 'actionType', label: 'Action Type' },
    { key: 'moduleFlow', label: 'Module Flow' },
    { key: 'mandays', label: 'Mandays' },
    { key: 'isParallel', label: 'Parallel', render: (val: any) => val ? '✔' : '✖' },
    { key: 'isPublic', label: 'Public', render: (val: any) => val ? '✔' : '✖' },
    { key: 'isUsingNotification', label: 'Notification', render: (val: any) => val ? '✔' : '✖' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Master Tracker</h1>
        <p className="page-subtitle">Manage tracker data</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '14px', color: 'var(--text-light)', marginRight: '8px' }}>Show</span>
            <select className="form-input" style={{ width: '80px', display: 'inline-block' }}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <form style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-light)', marginRight: '8px' }}>Search:</label>
              <input 
                type="text" 
                name="search" 
                defaultValue={search} 
                className="form-input" 
                placeholder="Search item" 
              />
            </form>
            <button className="btn btn-primary">Add</button>
          </div>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

        <DataTable columns={columns} data={trackers} />
        
        {/* Pass dummy totalRecords for now since API might not return it in this simple call, 
            or adjust if API returns wrapper */}
        <Pagination 
          currentPage={page} 
          totalRecords={50} // TODO: Update based on actual API response wrapper
          pageSize={limit} 
          onPageChange={() => {}} 
        />
      </div>
    </div>
  );
}
