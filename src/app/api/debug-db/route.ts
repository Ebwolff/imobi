import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: "No session" }, { status: 401 })

        // 1. Technical Check
        const { data: saasUser, error: saasError } = await (supabase.from('saas_users') as any)
            .select('*')
            .eq('id', user.id)
            .single()

        return NextResponse.json({
            sessionUser: {
                id: user.id,
                email: user.email
            },
            saasRecord: {
                found: !!saasUser,
                data: saasUser,
                error: saasError
            },
            timestamp: new Date().toISOString()
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
