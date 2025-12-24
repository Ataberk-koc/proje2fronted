import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const res = await fetch('http://127.0.0.1:8000/api/languages');
		if (!res.ok) {
			return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 });
		}
		const data = await res.json();
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
