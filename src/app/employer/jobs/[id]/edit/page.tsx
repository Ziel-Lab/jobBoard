import EditJobForm from '@/components/jobs/EditJobForm'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditJobForm id={id} />
}