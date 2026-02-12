'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// =============================================
// TENANT MANAGEMENT (Admin Only)
// =============================================

export async function getAllTenants() {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await supabase
        .from('tenants')
        .select(`
            *,
            subscriptions (
                id,
                status,
                plan_id,
                plans (nome, slug)
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error loading tenants:", error)
        return []
    }

    return data || []
}

export async function getTenantStats() {
    const supabase = await createClient()

    // @ts-ignore
    const { data: tenants } = await supabase
        .from('tenants')
        .select('id, status', { count: 'exact' })

    // @ts-ignore
    const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

    const active = tenants?.filter(t => t.status === 'ativo').length || 0
    const suspended = tenants?.filter(t => t.status === 'suspenso').length || 0
    const total = tenants?.length || 0

    return {
        total,
        active,
        suspended,
        trial: total - active - suspended,
        totalLeads: totalLeads || 0
    }
}

export async function createTenant(formData: FormData) {
    const supabase = await createClient()

    const nome_empresa = formData.get('nome_empresa') as string
    const email_principal = formData.get('email_principal') as string
    const cnpj = formData.get('cnpj') as string
    const plano = formData.get('plano') as string || 'free'

    if (!nome_empresa || !email_principal) {
        return { error: 'Nome e email são obrigatórios.' }
    }

    // Generate slug
    const slug = nome_empresa
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    // @ts-ignore
    const { data, error } = await supabase
        .from('tenants')
        .insert({
            nome_empresa,
            email_principal,
            cnpj,
            plano,
            slug,
            status: 'ativo'
        })
        .select()
        .single()

    if (error) {
        console.error(error)
        if (error.code === '23505') {
            return { error: 'Já existe um tenant com esse nome.' }
        }
        return { error: 'Erro ao criar tenant.' }
    }

    revalidatePath('/admin-saas/tenants')
    return { success: true, tenant: data }
}

export async function updateTenantStatus(tenantId: string, status: string) {
    const supabase = await createClient()

    // @ts-ignore
    const { error } = await supabase
        .from('tenants')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', tenantId)

    if (error) {
        console.error(error)
        return { error: 'Erro ao atualizar status.' }
    }

    revalidatePath('/admin-saas/tenants')
    return { success: true }
}

// =============================================
// PLANS MANAGEMENT
// =============================================

export async function getPlans() {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('valor_mensal')

    if (error) {
        console.error("Error loading plans:", error)
        return []
    }

    return data || []
}

export async function createPlan(formData: FormData) {
    const supabase = await createClient()

    const nome = formData.get('nome') as string
    const valor_mensal = parseFloat(formData.get('valor_mensal') as string) || 0
    const limite_usuarios = parseInt(formData.get('limite_usuarios') as string) || 5
    const limite_leads = parseInt(formData.get('limite_leads') as string) || 500

    if (!nome) {
        return { error: 'Nome do plano é obrigatório.' }
    }

    const slug = nome.toLowerCase().replace(/\s+/g, '-')

    // @ts-ignore
    const { error } = await supabase
        .from('plans')
        .insert({
            nome,
            slug,
            valor_mensal,
            limite_usuarios,
            limite_leads
        })

    if (error) {
        console.error(error)
        return { error: 'Erro ao criar plano.' }
    }

    revalidatePath('/admin-saas/plans')
    return { success: true }
}

// =============================================
// AUDIT LOGS
// =============================================

export async function getAuditLogs(limit = 50) {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await supabase
        .from('audit_logs')
        .select(`
            *,
            tenants (nome_empresa)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error("Error loading logs:", error)
        return []
    }

    return data || []
}

export async function logAction(
    acao: string,
    entidade?: string,
    entidade_id?: string,
    tenant_id?: string,
    detalhes?: object
) {
    const supabase = await createClient()

    // @ts-ignore
    await supabase.from('audit_logs').insert({
        acao,
        entidade,
        entidade_id,
        tenant_id,
        detalhes
    })
}
