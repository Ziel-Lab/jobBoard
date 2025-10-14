import React from 'react'

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  return (
    <div>Job Detail Page - ID: {id}</div>
  )
}