import { NextResponse } from 'next/server'
import { teamInvite } from '@/lib/api'

export async function POST(req: Request) {
	try {
		const auth = req.headers.get('authorization') || ''
		const token = auth.replace(/^Bearer\s+/i, '')
		const body = await req.json()
		await teamInvite({ email: body.email, role: body.role }, token)
		return NextResponse.json({ ok: true })
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


