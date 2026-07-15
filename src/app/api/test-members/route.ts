import { NextResponse } from 'next/server'
import { getOrganizationMembers } from '@/app/(dashboard)/superadmin/organization/actions'

export async function GET() {
  const members = await getOrganizationMembers()
  return NextResponse.json({ members })
}
