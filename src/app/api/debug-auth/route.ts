import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // 1. Get all SaaS users
    const { data: saasUsers } = await supabase
        .from('saas_users')
        .select('*')

    // 2. Get some Auth users to compare (limited for security)
    const { data: authUsers } = await supabase.auth.admin.listUsers()

    const debugData = {
        timestamp: new Date().toISOString(),
        saas_users_count: saasUsers?.length || 0,
        saas_users_list: saasUsers?.map(u => ({ id: u.id, email: u.email, role: u.role })),
        auth_users_found: authUsers?.users?.map(u => ({ id: u.id, email: u.email })),
        match_check: saasUsers?.map(su => ({
            email: su.email,
            id: su.id,
            exists_in_auth: authUsers?.users?.some(au => au.id === su.id)
        }))
    }

    return NextResponse.json(debugData)
}
