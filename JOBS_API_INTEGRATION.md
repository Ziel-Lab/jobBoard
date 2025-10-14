# Jobs API Integration Summary

## Overview
Successfully integrated the backend job posting APIs with the frontend application. All CRUD operations are now connected to the backend endpoints.

## What Was Changed

### 1. Type Definitions (`src/types/job.ts`)
- Updated `Job` interface to match backend schema:
  - `title` → `jobTitle`
  - `location` → `officeLocation`
  - `salaryMin/Max` → `minSalary/maxSalary`
  - `description` → `jobDescription`
  - `responsibilities` → `keyResponsibilities`
  - `requirements` → `requirementsQualifications`
  - `benefits` → `benefitsPerks`
  - `skills` → `requiredSkills`
  - `status` → `jobStatus`
  - Employment types: `full-time` → `full_time`, etc.

- Added new interfaces:
  - `JobCreateInput` - For creating jobs
  - `JobUpdateInput` - For updating jobs
  - `PaginatedJobsResponse` - For paginated job listings
  - `JobStatusChangeInput` - For changing job status

### 2. Jobs API Client (`src/lib/jobs-api.ts`)
Created a comprehensive API service with all CRUD operations:
- `createJob(data)` - Create new job posting
- `listJobs(query?)` - List jobs with filters (status, type, remote, pagination)
- `getJob(jobId)` - Get specific job details
- `updateJob(jobId, data)` - Update job posting
- `changeJobStatus(jobId, status)` - Change job status (draft/published/paused/closed)
- `deleteJob(jobId)` - Delete job posting

### 3. Authenticated API Client (`src/lib/authenticated-api.ts`)
Added support for additional HTTP methods:
- `delete<T>(endpoint)` - DELETE requests
- `patch<T>(endpoint, data)` - PATCH requests

Both methods handle authentication, subdomain headers, and error handling automatically.

### 4. API Route Proxies
Created Next.js API routes to proxy requests to the backend:

#### `src/app/api/jobs/route.ts`
- `GET /api/jobs` - List jobs with filters
- `POST /api/jobs` - Create new job

#### `src/app/api/jobs/[jobId]/route.ts`
- `GET /api/jobs/{id}` - Get specific job
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

#### `src/app/api/jobs/[jobId]/status/route.ts`
- `PATCH /api/jobs/{id}/status` - Change job status

All routes:
- Handle authentication headers
- Include company subdomain header (`X-Company-Subdomain`)
- Properly proxy requests to backend
- Handle errors gracefully

### 5. Job Creation Form (`src/app/employer/jobs/new/page.tsx`)
Updated the form to work with backend API:
- All field names mapped to backend schema
- Employment types use underscore format (`full_time` instead of `full-time`)
- Form submits to `/api/jobs` proxy endpoint
- Proper error handling with user feedback
- Success state with automatic redirect

### 6. Jobs Management Page (`src/app/employer/jobs/page.tsx`)
Completely refactored to use backend API:
- Fetches jobs from backend on component mount
- Supports status filtering (all, published, draft, paused, closed)
- Client-side search by job title and location
- Real-time job deletion via API
- Job status change functionality with buttons:
  - Draft → Publish
  - Published → Pause/Close
  - Paused → Resume/Close
- Loading states during API calls
- Proper error handling with user alerts

## API Integration Details

### Backend Base URL
Set via environment variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Authentication
All requests automatically include:
- JWT token from localStorage/cookies
- Company subdomain header (`X-Company-Subdomain`)
- Proper Content-Type headers

### Request/Response Flow
```
Frontend Component
    ↓
Jobs API Client (src/lib/jobs-api.ts)
    ↓
Authenticated API Client (src/lib/authenticated-api.ts)
    ↓
Next.js API Route Proxy (src/app/api/jobs/...)
    ↓
Backend API (http://localhost:5000/api/jobs)
```

## Supported Operations

### Create Job
```typescript
const job = await jobsApi.createJob({
  jobTitle: "Senior Backend Engineer",
  employmentType: "full_time",
  experienceLevel: "senior",
  officeLocation: "San Francisco, CA",
  isRemote: true,
  currency: "USD",
  minSalary: 120000,
  maxSalary: 180000,
  jobDescription: "...",
  keyResponsibilities: "...",
  requirementsQualifications: "...",
  benefitsPerks: "...",
  requiredSkills: ["Python", "Flask", "PostgreSQL"],
  applicationDeadline: "2025-12-31",
  jobStatus: "draft"
})
```

### List Jobs with Filters
```typescript
const response = await jobsApi.listJobs({
  jobStatus: 'published',
  employmentType: 'full_time',
  isRemote: true,
  page: 1,
  pageSize: 10,
  sortBy: 'created_at',
  sortOrder: 'desc'
})
```

### Get Specific Job
```typescript
const job = await jobsApi.getJob('job-id')
```

### Update Job
```typescript
const updatedJob = await jobsApi.updateJob('job-id', {
  jobTitle: "Senior Backend Engineer - Updated",
  minSalary: 130000,
  maxSalary: 190000
})
```

### Change Job Status
```typescript
const job = await jobsApi.changeJobStatus('job-id', {
  status: 'published' // or 'draft', 'paused', 'closed'
})
```

### Delete Job
```typescript
const success = await jobsApi.deleteJob('job-id')
```

## Field Mapping Reference

| Frontend Field             | Backend Field              |
|---------------------------|----------------------------|
| `jobTitle`                | `jobTitle`                 |
| `officeLocation`          | `officeLocation`           |
| `isRemote`                | `isRemote`                 |
| `employmentType`          | `employmentType`           |
| `experienceLevel`         | `experienceLevel`          |
| `minSalary`               | `minSalary`                |
| `maxSalary`               | `maxSalary`                |
| `currency`                | `currency`                 |
| `jobDescription`          | `jobDescription`           |
| `keyResponsibilities`     | `keyResponsibilities`      |
| `requirementsQualifications` | `requirementsQualifications` |
| `benefitsPerks`           | `benefitsPerks`            |
| `requiredSkills`          | `requiredSkills`           |
| `applicationDeadline`     | `applicationDeadline`      |
| `jobStatus`               | `jobStatus`                |

## Employment Type Values
- `full_time` (not `full-time`)
- `part_time` (not `part-time`)
- `contract`
- `internship`

## Job Status Values
- `draft` - Not published yet
- `published` - Active and visible
- `paused` - Temporarily hidden
- `closed` - No longer accepting applications

## Error Handling
All API calls include proper error handling:
- Network errors are caught and logged
- HTTP errors return null/false with console warnings
- User-facing alerts for failed operations
- Loading states during async operations

## Next Steps
1. Test all operations with the running backend
2. Add pagination support for large job lists
3. Implement optimistic UI updates
4. Add toast notifications instead of alerts
5. Add form validation for complex fields
6. Implement job duplication feature
7. Add bulk operations (delete multiple jobs)

## Testing Checklist
- [ ] Create a new job (draft)
- [ ] Create a new job (published)
- [ ] List all jobs
- [ ] Filter jobs by status
- [ ] Search jobs by title
- [ ] View job details
- [ ] Update job information
- [ ] Publish a draft job
- [ ] Pause a published job
- [ ] Resume a paused job
- [ ] Close a job
- [ ] Delete a job
- [ ] Verify authentication headers are sent
- [ ] Verify subdomain header is sent
- [ ] Test error handling (network failure)
- [ ] Test error handling (401 unauthorized)

