import { NextResponse } from 'next/server'
import type { CandidateProfile } from '@/types/profile'

const candidate: CandidateProfile = {
  id: 'cand-1',
  fullName: 'Ananya Sharma',
  headline: 'Frontend Engineer • React | TypeScript | Next.js',
  location: 'Bengaluru, IN',
  email: 'ananya@example.com',
  website: 'https://ananya.dev',
  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/ananya' },
    { label: 'GitHub', url: 'https://github.com/ananya' },
  ],
  summary: 'Engineer focused on delightful, accessible web experiences and design systems.',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js', 'Testing Library'],
  experience: [
    {
      id: 'exp-1',
      role: 'Frontend Engineer',
      company: 'Hulo',
      location: 'Remote',
      startDate: '2023-01-01',
      summary: 'Building candidate experiences and component libraries.',
      achievements: [
        'Shipped a reusable UI kit used across 5 pages',
        'Improved performance (LCP) by 30% via code-split and memoization',
      ],
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    },
    {
      id: 'exp-2',
      role: 'UI Engineer',
      company: 'Acme',
      location: 'Mumbai, IN',
      startDate: '2021-05-01',
      endDate: '2022-12-15',
      summary: 'Partnered with design to create an accessible design system.',
      skills: ['React', 'Storybook', 'A11y'],
    },
  ],
  education: [
    { id: 'edu-1', school: 'IIT Bombay', degree: 'B.Tech', field: 'CSE', startDate: '2017-08-01', endDate: '2021-05-30' },
  ],
  projects: [
    { id: 'proj-1', name: 'OpenJobs', description: 'Job board UI with filters and animations', skills: ['Next.js', 'Tailwind'], link: 'https://openjobs.example.com' },
  ],
  certifications: [
    { id: 'cert-1', name: 'AWS Cloud Practitioner', issuer: 'AWS', date: '2022-08-01' },
  ],
  preferences: {
    locations: ['Remote', 'Bengaluru'],
    remote: true,
    employmentTypes: ['full-time', 'contract'],
    expectedSalaryMin: 1800000,
    expectedSalaryMax: 3000000,
    currency: 'INR',
  },
  resumeUrl: '#',
}

export async function GET ()
{
  return NextResponse.json(candidate)
}


