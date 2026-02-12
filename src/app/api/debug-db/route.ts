import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "No session found. Please login first." }, { status: 401 })
        }

        // 1. Check if table exists and user record is present
        const { data: saasRecord, error: dbError } = await (supabase.from('saas_users') as any)
            .select('*')
            .eq('id', user.id)
            .single()

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            auth: {
                id: user.id,
                email: user.email
            },
            database: {
                table_exists: dbError?.code !== 'PGRST205',
                record_found: !!saasRecord,
                record: saasRecord,
                error: dbError
            }
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
