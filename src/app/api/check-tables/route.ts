import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = await createClient()

        // Check saas_users specifically
        const { error: saasError } = await supabase.from('saas_users').select('count', { count: 'exact', head: true })

        // Check tenants as well
        const { error: tenantsError } = await supabase.from('tenants').select('count', { count: 'exact', head: true })

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            tables: {
                saas_users: { visible: !saasError, error: saasError },
                tenants: { visible: !tenantsError, error: tenantsError }
            }
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
