'use server';

import { fetchKalbeApi } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function createRequest(data: any) {
  try {
    const res = await fetchKalbeApi('/requests', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to create request' };
    }

    // Call logging API
    await fetch('http://localhost:5036/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'INFO',
        action: 'CREATE_REQUEST',
        username: 'System', 
        message: `Created request for project ${data.projectCode}`
      })
    }).catch(e => console.log('Log API error:', e));

    revalidatePath('/transaction-requests');
    return { success: true, message: 'Request created successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Server Error' };
  }
}

export async function updateRequest(data: any) {
  try {
    const res = await fetchKalbeApi('/requests', {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to update request' };
    }

    // Call logging API
    await fetch('http://localhost:5036/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'INFO',
        action: 'UPDATE_REQUEST',
        username: 'System', 
        message: `Updated request ${data.projectCode}`
      })
    }).catch(e => console.log('Log API error:', e));

    revalidatePath('/transaction-requests');
    return { success: true, message: 'Request updated successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Server Error' };
  }
}

export async function deleteRequest(id: string) {
  try {
    const res = await fetchKalbeApi('/requests', {
      method: 'DELETE',
      body: JSON.stringify({
        id,
        deletedBy: 'System',
        doHardDelete: false
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to delete request' };
    }

    // Call logging API
    await fetch('http://localhost:5036/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'INFO',
        action: 'DELETE_REQUEST',
        username: 'System', 
        message: `Deleted request ${id}`
      })
    }).catch(e => console.log('Log API error:', e));

    revalidatePath('/transaction-requests');
    return { success: true, message: 'Request deleted successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Server Error' };
  }
}
