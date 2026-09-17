import React from 'react';
import { fetchKalbeApi } from '@/lib/api';

export default async function DashboardPage() {
  let trackers: any[] = [];
  let requests: any[] = [];
  let error = null;

  try {
    // Fetch both datasets concurrently
    const [trackersRes, requestsRes] = await Promise.all([
      fetchKalbeApi('/trackers/paging?page=1&limit=100', {}),
      fetchKalbeApi('/requests/paging?page=1&limit=100', {})
    ]);

    if (trackersRes.ok && requestsRes.ok) {
      const tData = await trackersRes.json();
      const rData = await requestsRes.json();
      
      trackers = tData.data?.data || tData.data || tData || [];
      requests = rData.data?.data || rData.data || rData || [];
    } else {
      error = 'Failed to fetch data from API. Please ensure your token is valid.';
    }
  } catch (err: any) {
    error = err.message || 'Server error occurred.';
  }

  // Calculate statistics
  const totalTrackers = trackers.length;
  const totalRequests = requests.length;
  
  // Sum of fees
  const totalRevenue = requests.reduce((sum, req) => sum + (Number(req.totalFee) || 0), 0);
  
  // Average Lead Time
  const avgLeadTime = totalRequests > 0 
    ? requests.reduce((sum, req) => sum + (Number(req.leadTime) || 0), 0) / totalRequests 
    : 0;

  // Recent 5 requests (assuming they are somewhat sorted or we just slice the first 5)
  const recentRequests = requests.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Welcome back to Biopharma Assessment Dashboard</p>
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#FEE2E2', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '24px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Total Requests</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalRequests}</div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--secondary-color)' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Total Trackers</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{totalTrackers}</div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Total Estimated Fees</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--secondary-color)' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Avg Lead Time</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
            {Math.round(avgLeadTime)} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>days</span>
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="card">
        <h2 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-dark)' }}>Recent Lab Requests</h2>
        {recentRequests.length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>No recent requests found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-light)', fontSize: '13px' }}>Project Code</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-light)', fontSize: '13px' }}>Status</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-light)', fontSize: '13px' }}>Received Date</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-light)', fontSize: '13px' }}>Fee</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>{req.projectCode || '-'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                      <span style={{ 
                        backgroundColor: 'var(--light-green)', 
                        color: 'var(--secondary-color)', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {req.lastStatus || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--text-light)' }}>
                      {req.receivedDate ? new Date(req.receivedDate).toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600' }}>
                      ${Number(req.totalFee || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
