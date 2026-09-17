import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  (await cookies()).delete('access_token');
  (await cookies()).delete('refresh_token');
  
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
