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
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/admin') || isSuperadminRoute

  // Protect dashboard routes
  if (isDashboardRoute && !user) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
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
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Redirect to dashboard if logged in and trying to access login page
    if (isAuthRoute) {
      if (profile?.role === 'superadmin') {
        return NextResponse.redirect(new URL('/superadmin', request.url))
      }
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return supabaseResponse
}
