import { NextResponse } from 'next/server'
import { setupSuperAdmin } from '@/lib/api'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		await setupSuperAdmin(body)
		return NextResponse.json({ ok: true })
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


