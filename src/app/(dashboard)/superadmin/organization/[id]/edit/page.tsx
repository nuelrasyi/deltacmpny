import { getOrganizationMemberById } from '../../actions'
import OrganizationForm from '../../OrganizationForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Anggota Organisasi - DIL CMS',
}

export default async function EditOrganizationMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getOrganizationMemberById(id)

  if (!member) {
    notFound()
  }

  return <OrganizationForm initialData={member} />
}
