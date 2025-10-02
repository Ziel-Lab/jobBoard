import { NextResponse } from 'next/server'
import type { EmployerProfile } from '@/types/profile'

const employer: EmployerProfile = {
  id: 'emp-1',
  companyName: 'Hulo',
  location: 'Bengaluru, IN',
  website: 'https://hulo.example.com',
  description: 'We build tools that help candidates and employers connect better.',
  size: '51-200',
  industry: 'HR Tech',
  socials: [
    { label: 'Website', url: 'https://hulo.example.com' },
    { label: 'LinkedIn', url: 'https://linkedin.com/company/hulo' },
  ],
}

export async function GET ()
{
  return NextResponse.json(employer)
}


