import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  const isSuperadminRoute = request.nextUrl.pathname.startsWith('/superadmin')
  const isLegacyAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // Protect dashboard routes
  if (isSuperadminRoute && !user) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect old admin links to superadmin
  if (isLegacyAdminRoute) {
    const url = request.nextUrl.pathname.replace(/^\/admin/, '/superadmin')
    return NextResponse.redirect(new URL(url, request.url))
  }

  if (user && (isSuperadminRoute || isAuthRoute)) {
    // Gunakan service role secara terpisah (di runtime edge) agar tidak terhalang RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false }
      }
    )

    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // Superadmin role protection
    if (isSuperadminRoute && profile?.role !== 'superadmin') {
      // If they somehow have the wrong role, redirect to home or login
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Redirect to dashboard if logged in and trying to access login page
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/superadmin', request.url))
    }
  }

  return supabaseResponse
}
