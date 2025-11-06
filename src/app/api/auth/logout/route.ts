import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80'
    console.log('[Logout Proxy] Using API URL:', apiUrl)
    
    // Get all cookies from the request
    const requestCookies = request.headers.get('cookie')
    console.log('[Logout Proxy] Forwarding cookies:', requestCookies)
    
    // Forward the request to the backend
    const response = await fetch(`${apiUrl}/auth/logout`, {  // Removed /api prefix since it's part of base URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies and auth header
        ...(requestCookies ? { 'Cookie': requestCookies } : {}),
        ...request.headers.get('authorization') 
          ? { 'Authorization': request.headers.get('authorization')! }
          : {}
      },
      // Include credentials to handle cookies
      credentials: 'include'
    })

    console.log('[Logout Proxy] Backend response status:', response.status)

    if (!response.ok) {
      console.error('[Logout Proxy] Backend response:', await response.text())
      throw new Error(`Logout failed: ${response.statusText}`)
    }

    // Get all cookies and body from the response
    const responseCookies = response.headers.get('set-cookie')
    const responseBody = await response.json()
    
    console.log('[Logout Proxy] Response cookies:', responseCookies)
    
    // Create our response
    const nextResponse = NextResponse.json(
      responseBody,
      {
        status: response.status,
        statusText: response.statusText,
      }
    )

    // Forward the Set-Cookie headers from the backend response
    if (responseCookies) {
      console.log('[Logout Proxy] Forwarding Set-Cookie headers')
      nextResponse.headers.set('Set-Cookie', responseCookies)
    }

    // Copy CORS headers
    const origin = request.headers.get('origin')
    if (origin) {
      nextResponse.headers.set('Access-Control-Allow-Origin', origin)
      nextResponse.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    
    console.log('[Logout Proxy] Response ready with status:', nextResponse.status)

    return nextResponse
  } catch (error) {
    console.error('Proxy logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  })
}
