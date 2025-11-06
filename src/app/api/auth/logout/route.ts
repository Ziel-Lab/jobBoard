import { type NextRequest, NextResponse } from 'next/server'
import { getForwardedCookies } from '@/lib/api-auth-helpers'
import { getCookieDomain } from '@/lib/subdomain-utils'

export async function POST(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80'
    console.log('[Logout Proxy] Using API URL:', apiUrl)
    
    // Get cookies from the request using Next.js cookies() - these are cookies set for the frontend domain
    const forwardedCookies = await getForwardedCookies()
    console.log('[Logout Proxy] Forwarding cookies:', forwardedCookies)
    
    // Forward the request to the backend
    const response = await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies to backend
        ...(forwardedCookies ? { 'Cookie': forwardedCookies } : {}),
        // Forward authorization header if present
        ...request.headers.get('authorization') 
          ? { 'Authorization': request.headers.get('authorization')! }
          : {}
      },
      credentials: 'include'
    })

    console.log('[Logout Proxy] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Logout Proxy] Backend response error:', errorText)
      throw new Error(`Logout failed: ${response.statusText}`)
    }

    // Get response body
    const responseBody = await response.json()
    
    // Create our response
    const nextResponse = NextResponse.json(
      responseBody,
      {
        status: response.status,
        statusText: response.statusText,
      }
    )

    // Get the cookie domain for the frontend (visasure.co)
    const cookieDomain = getCookieDomain(request)
    console.log('[Logout Proxy] Using cookie domain:', cookieDomain || 'none (host-only)')

    // Parse and rewrite Set-Cookie headers from backend to use frontend domain
    const setCookieHeaders = response.headers.getSetCookie()
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      console.log('[Logout Proxy] Backend sent Set-Cookie headers:', setCookieHeaders.length)
      
      // Clear auth cookies on the frontend domain
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 0, // Clear the cookie
        path: '/',
        ...(cookieDomain ? { domain: cookieDomain } : {})
      }

      // Clear common auth cookie names
      const authCookieNames = ['accessToken', 'refreshToken', 'user_id']
      for (const cookieName of authCookieNames) {
        nextResponse.cookies.set(cookieName, '', cookieOptions)
        console.log('[Logout Proxy] Clearing cookie:', cookieName)
      }

      // Also forward any other Set-Cookie headers from backend (rewritten for frontend domain)
      for (const setCookie of setCookieHeaders) {
        // Parse the Set-Cookie header
        const [nameValue, ...attributes] = setCookie.split(';')
        const [name] = nameValue.split('=')
        const trimmedName = name.trim()
        
        // If it's an auth cookie, we already cleared it above
        if (!authCookieNames.includes(trimmedName)) {
          // Set the cookie with rewritten domain for frontend
          nextResponse.cookies.set(trimmedName, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: 0,
            path: '/',
            ...(cookieDomain ? { domain: cookieDomain } : {})
          })
        }
      }
    } else {
      // If backend didn't send Set-Cookie headers, still clear cookies on frontend domain
      console.log('[Logout Proxy] No Set-Cookie headers from backend, clearing frontend cookies')
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 0,
        path: '/',
        ...(cookieDomain ? { domain: cookieDomain } : {})
      }
      
      const authCookieNames = ['accessToken', 'refreshToken', 'user_id']
      for (const cookieName of authCookieNames) {
        nextResponse.cookies.set(cookieName, '', cookieOptions)
        console.log('[Logout Proxy] Clearing cookie:', cookieName)
      }
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
    console.error('[Logout Proxy] Error:', error)
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
