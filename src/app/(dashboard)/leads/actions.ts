'use server'

import { createClient } from "@/lib/supabase/server"
import { getCurrentTenantId } from "@/lib/tenant"
import { revalidatePath } from "next/cache"

export async function getPipelineStages() {
    const supabase = await createClient()

    // Get the default pipeline (assuming single pipeline for now)
    // @ts-ignore
    const { data: pipeline } = await supabase
        .from('pipelines')
        .select('id')
        .limit(1)
        .single()

    if (!pipeline) return []

    // @ts-ignore
    const { data: stages, error } = await supabase
        .from('pipeline_stages')
        .select('*')
        // @ts-ignore: pipeline.id type inference
        .eq('pipeline_id', pipeline.id)
        .order('position')

    if (error) {
        console.error("Error loading stages:", error)
    }

    return stages || []
}

export async function getLeads() {
    const supabase = await createClient()

    // @ts-ignore
    const { data: leads, error } = await supabase
        .from('leads')
        .select('*, pipeline_stages(name, color)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error loading leads:", error)
    }

    return leads || []
}

export async function createLead(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const stageId = formData.get('stage_id') as string

    if (!name || !stageId) {
        return { error: 'Nome e Etapa são obrigatórios.' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id
    const tenantId = await getCurrentTenantId()

    // @ts-ignore - tenant_id column exists but types not regenerated
    const { error } = await (supabase.from('leads') as any).insert({
        name,
        phone,
        stage_id: stageId,
        user_id: userId,
        tenant_id: tenantId
    })

    if (error) {
        console.error(error)
        return { error: 'Erro ao criar lead.' }
    }

    revalidatePath('/leads')
    return { success: true }
}

export async function updateLeadStage(leadId: string, stageId: string) {
    const supabase = await createClient()

    // @ts-ignore
    const { error } = await (supabase.from('leads') as any)
        .update({ stage_id: stageId })
        .eq('id', leadId)

    if (error) {
        console.error("Error updating lead stage:", error)
        return { error: 'Erro ao mover lead.' }
    }

    revalidatePath('/leads')
    return { success: true }
}
