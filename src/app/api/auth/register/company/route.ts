import { NextResponse } from 'next/server'
import { authRegisterCompany } from '@/lib/api'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const data = await authRegisterCompany(body)
		return NextResponse.json(data)
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


