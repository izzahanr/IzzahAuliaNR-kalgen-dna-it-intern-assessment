import React from 'react';
import { fetchKalbeApi, buildPaginationHeaders } from '@/lib/api';
import TransactionRequestClient from './TransactionRequestClient';

export default async function TransactionRequestsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';
  const limit = 10;

  let requests = [];
  let error = null;

  try {
    const headers = buildPaginationHeaders(page, limit, search, 'receivedDate', 'DESC');
    const res = await fetchKalbeApi('/requests/paging', { headers });
    
    if (res.ok) {
      requests = await res.json();
    } else {
      const errData = await res.json().catch(() => ({}));
      error = errData.message || 'Failed to fetch requests';
    }
  } catch (e: any) {
    error = e.message || 'An error occurred';
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Transaction Request</h1>
        <p className="page-subtitle">Manage lab analysis requests</p>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <TransactionRequestClient initialRequests={requests} />
    </div>
  );
}
