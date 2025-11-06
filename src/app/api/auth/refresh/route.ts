import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Create a response to store cookies
    const cookieStore = await cookies()
    const response = new NextResponse()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options
            })
          },
          remove(name: string) {
            response.cookies.delete(name)
          }
        }
      }
    )

    // Get refresh token from request body
    let { refresh_token } = await request.json().catch(() => ({}))
    
    // If not in body, try to get from cookie
    if (!refresh_token) {
      refresh_token = cookieStore.get('sb-refresh-token')?.value
    }

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'refresh_token is required' },
        { status: 400 }
      )
    }

    // Refresh the session
    const { data: { session, user }, error } = await supabase.auth.refreshSession({
      refresh_token
    })

    if (error || !session || !user) {
      console.error('Token refresh failed:', error?.message)
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Prepare the response data
    const responseData = {
      user: { 
        id: user.id, 
        email: user.email 
      },
      accessToken: session.access_token,
      expiresAt: session.expires_at,
      session: {
        access_token: session.access_token,
        expires_at: session.expires_at,
        refresh_token: session.refresh_token
      }
    }

    // Create new response with the data
    const finalResponse = NextResponse.json(responseData)

    // Copy over the cookies
    response.cookies.getAll().forEach(cookie => {
      finalResponse.cookies.set(cookie)
    })

    // Set CORS headers
    const origin = request.headers.get('origin')
    if (origin) {
      finalResponse.headers.set('Access-Control-Allow-Origin', origin)
      finalResponse.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    return finalResponse

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 401 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin')
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  })
}