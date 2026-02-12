import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Schema for validation
const leadSchema = z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    interest_value: z.number().optional(),
    source: z.string().default('webhook'),
    notes: z.string().optional()
})

export async function POST(request: Request) {
    // Verify API Secret to prevent spam
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()
        const validatedData = leadSchema.parse(body)

        // Use Service Role to bypass RLS (since webhook is not a user)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Get default pipeline stage (New Lead)
        // Ideally cache this or pass as param
        const { data: pipeline } = await (supabaseAdmin.from('pipelines') as any)
            .select('id')
            .single()

        const { data: stage } = await (supabaseAdmin.from('pipeline_stages') as any)
            .select('id')
            .eq('pipeline_id', pipeline?.id)
            .order('position')
            .limit(1)
            .single()

        // Insert Lead
        const { data, error } = await (supabaseAdmin.from('leads') as any)
            .insert({
                name: validatedData.name,
                phone: validatedData.phone,
                email: validatedData.email,
                interest_value: validatedData.interest_value,
                source: validatedData.source,
                notes: validatedData.notes,
                stage_id: stage?.id
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, lead: data })

    } catch (error) {
        console.error('Webhook Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error },
            { status: 500 }
        )
    }
}
