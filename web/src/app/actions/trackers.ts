'use server';

import { fetchKalbeApi } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function createTracker(data: any) {
  try {
    const res = await fetchKalbeApi('/trackers', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to create tracker' };
    }

    // Call logging API
    await fetch('http://localhost:5036/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'INFO',
        action: 'CREATE_TRACKER',
        username: 'System', // from session later
        message: `Created tracker ${data.code}`
      })
    }).catch(e => console.log('Log API error:', e));

    revalidatePath('/master-trackers');
    return { success: true, message: 'Tracker created successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Server Error' };
  }
}

export async function updateTracker(data: any) {
  try {
    const res = await fetchKalbeApi('/trackers', {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to update tracker' };
    }

    // Call logging API
    await fetch('http://localhost:5036/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'INFO',
        action: 'UPDATE_TRACKER',
        username: 'System', 
        message: `Updated tracker ${data.code}`
      })
    }).catch(e => console.log('Log API error:', e));

    revalidatePath('/master-trackers');
    return { success: true, message: 'Tracker updated successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Server Error' };
  }
}

export async function deleteTracker(id: string) {
  try {
    const res = await fetchKalbeApi('/trackers', {
      method: 'DELETE',
      body: JSON.stringify({
        id,
        deletedBy: 'System',
        doHardDelete: false
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to delete tracker' };
    }

    // Call logging API
    await fetch('http://localhost:5036/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'INFO',
        action: 'DELETE_TRACKER',
        username: 'System', 
        message: `Deleted tracker ${id}`
      })
    }).catch(e => console.log('Log API error:', e));

    revalidatePath('/master-trackers');
    return { success: true, message: 'Tracker deleted successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Server Error' };
  }
}
