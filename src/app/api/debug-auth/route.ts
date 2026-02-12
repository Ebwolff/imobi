import { createClient } from "@/lib/supabase/server"
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let saasUser = null
    let dbError = null

    if (user) {
        // Check saas_users (this works if RLS policy allows it)
        const result = await (supabase.from('saas_users') as any)
            .select('*')
            .eq('id', user.id)
            .single()

        saasUser = result.data
        dbError = result.error
    }

    const debugData = {
        timestamp: new Date().toISOString(),
        session: user ? {
            id: user.id,
            email: user.email,
            role: user.role
        } : 'no session',
        saas_record: saasUser,
        db_error: dbError,
        note: "If saas_record is null and session is active, the UUID in saas_users does not match the session ID."
    }

    return NextResponse.json(debugData)
}
