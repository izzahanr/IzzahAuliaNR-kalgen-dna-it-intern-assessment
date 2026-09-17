import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // As per API docs:
    // {
    //   "appCode": "ASSESSMENT", 
    //   "moduleCode": "ALL", 
    //   "user": "assessment.it", 
    //   "password": "Password123?"
    // }
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-assessment-biopharma.kalbe.co.id';
    
    const kalbeRes = await fetch(`${apiUrl}/api/v1/authentication/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app_id': process.env.APP_ID || '',
        'app_key': process.env.APP_KEY || ''
      },
      body: JSON.stringify({
        appCode: 'ASSESSMENT',
        moduleCode: 'ALL',
        user: body.user,
        password: body.password
      })
    });

    if (!kalbeRes.ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const data = await kalbeRes.json();
    
    // Assuming the token is in data.accessToken or data.data.accessToken
    // We should parse it depending on actual Kalbe API response structure.
    // If we look at standard OAuth2 from Postman, it returns an access_token.
    const accessToken = data.access_token || (data.data && data.data.access_token);
    const refreshToken = data.refresh_token || (data.data && data.data.refresh_token);
    
    if (accessToken) {
      // Set HTTP-Only Cookie
      (await cookies()).set({
        name: 'access_token',
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
    }

    if (refreshToken) {
      (await cookies()).set({
        name: 'refresh_token',
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
