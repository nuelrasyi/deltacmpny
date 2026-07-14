import { getOrganizationMemberById } from '../../actions'
import OrganizationForm from '../../OrganizationForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Anggota Organisasi - DIL CMS',
}

export default async function EditOrganizationMemberPage({ params }: { params: { id: string } }) {
  const member = await getOrganizationMemberById(params.id)

  if (!member) {
    notFound()
  }

  return <OrganizationForm initialData={member} />
}
