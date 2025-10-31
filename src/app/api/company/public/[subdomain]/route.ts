import { NextRequest, NextResponse } from 'next/server'
import { getSubdomainFromRequest } from '@/lib/subdomain-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  try {
    const { subdomain } = await params
    
    // Validate subdomain parameter
    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain is required' },
        { status: 400 }
      )
    }

    // Get the actual subdomain from the request (in case of subdomain routing)
    const requestSubdomain = getSubdomainFromRequest(request)
    const finalSubdomain = requestSubdomain || subdomain

    console.log(`[API] Fetching company data for subdomain: ${finalSubdomain}`)

    // Construct the backend API URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const apiUrl = `${backendUrl}/company/careers/${finalSubdomain}`

    console.log(`[API] Backend URL: ${apiUrl}`)

    // Make request to backend
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers needed for your backend
        'X-Company-Subdomain': finalSubdomain,
      },
      // Add credentials if needed for your backend
      credentials: 'include',
    })

    if (!response.ok) {
      console.error(`[API] Backend error: ${response.status} ${response.statusText}`)
      
      // Return appropriate error response
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch company data' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Add CORS headers for subdomain requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // In production, specify your domains
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Company-Subdomain',
      'Access-Control-Allow-Credentials': 'true',
    }

    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders,
    })

  } catch (error) {
    console.error('[API] Error fetching company data:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Company-Subdomain',
        }
      }
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Company-Subdomain',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
