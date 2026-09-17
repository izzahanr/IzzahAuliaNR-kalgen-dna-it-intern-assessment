import React from 'react';
import { fetchKalbeApi, buildPaginationHeaders } from '@/lib/api';
import MasterTrackerClient from './MasterTrackerClient';

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

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <MasterTrackerClient initialTrackers={trackers} />
    </div>
  );
}
