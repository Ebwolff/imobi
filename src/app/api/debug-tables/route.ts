import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = await createClient()

        // 1. HEAD check
        const { error: headError } = await supabase.from('saas_users').select('count', { count: 'exact', head: true })

        // 2. SELECT check (exactly like actions.ts)
        const { data, error: selectError } = await (supabase.from('saas_users') as any)
            .select('role')
            .limit(1)

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            head_check: { visible: !headError, error: headError },
            select_check: { success: !selectError, data, error: selectError }
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
