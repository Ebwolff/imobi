import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = await createClient()

        // 1. Check if we can at least reach the DB
        const { data: health, error: healthError } = await supabase.from('tenants').select('count', { count: 'exact', head: true })

        // 2. Try to verify saas_users specifically
        const { data: saasCheck, error: saasError } = await supabase.from('saas_users').select('count', { count: 'exact', head: true })

        // 3. Try to get schema information via a generic RPC if exists
        // (Assuming we might have one, otherwise this will fail gracefully)

        return NextResponse.json({
            status: "connected",
            tenantsTable: {
                reachable: !healthError,
                error: healthError
            },
            saasUsersTable: {
                reachable: !saasError,
                error: saasError
            },
            timestamp: new Date().toISOString()
        })
    } catch (e: any) {
        return NextResponse.json({
            status: "error",
            error: e.message
        }, { status: 500 })
    }
}
