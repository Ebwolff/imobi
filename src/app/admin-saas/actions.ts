'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function checkSaaSAdmin() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { isError: true, data: { message: "User not authenticated" } }
        }

        // Check if user is in saas_users with correct role
        const { data: saasUser, error } = await (supabase.from('saas_users') as any)
            .select('role')
            .eq('id', user.id)
            .single()

        if (error || !saasUser || !['owner', 'admin_saas', 'suporte'].includes(saasUser.role)) {
            return {
                isError: true,
                data: {
                    message: "User not authorized",
                    userId: user.id,
                    email: user.email,
                    dbError: error
                }
            }
        }

        return { user }
    } catch (e: any) {
        return { isError: true, data: { message: "Internal Server Error", error: e.message } }
    }
}

// =============================================
// TENANT MANAGEMENT (Admin Only)
// =============================================

export async function getAllTenants() {
    const supabase = await createClient()
    const { data, error } = await (supabase.from('tenants') as any)
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

    if (error) return []
    return data || []
}

export async function getTenantById(id: string) {
    const supabase = await createClient()
    const { data, error } = await (supabase.from('tenants') as any)
        .select(`
            *,
            subscriptions (
                *,
                plans (*)
            )
        `)
        .eq('id', id)
        .single()

    if (error) return null
    return data
}

export async function getTenantStats() {
    const supabase = await createClient()
    const { data: tenants, error } = await (supabase.from('tenants') as any).select('status, created_at')

    if (error) return { total: 0, active: 0, newThisMonth: 0 }

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return {
        total: tenants.length,
        active: tenants.filter((t: any) => t.status === 'ativo').length,
        newThisMonth: tenants.filter((t: any) => new Date(t.created_at) >= firstDayOfMonth).length
    }
}

export async function updateTenant(id: string, updates: any) {
    const supabase = await createClient()
    const { error } = await (supabase.from('tenants') as any)
        .update(updates)
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin-saas/tenants')
    revalidatePath(`/admin-saas/tenants/${id}`)
    return { success: true }
}

export async function createTenant(data: any) {
    const supabase = await createClient()
    const { data: tenant, error } = await (supabase.from('tenants') as any)
        .insert(data)
        .select()
        .single()

    if (error) return { error: error.message }

    revalidatePath('/admin-saas/tenants')
    return { success: true, data: tenant }
}

export async function getPlans() {
    const supabase = await createClient()
    const { data, error } = await (supabase.from('plans') as any).select('*').order('valor_mensal', { ascending: true })
    if (error) return []
    return data
}

export async function createPlan(formData: FormData) {
    const supabase = await createClient()
    const data = {
        nome: formData.get('nome'),
        valor_mensal: parseFloat(formData.get('valor_mensal') as string),
        limite_usuarios: parseInt(formData.get('limite_usuarios') as string || '0'),
        limite_leads: parseInt(formData.get('limite_leads') as string || '0'),
        limite_automacoes: parseInt(formData.get('limite_automacoes') as string || '0'),
        limite_integracoes: parseInt(formData.get('limite_integracoes') as string || '0'),
        slug: (formData.get('nome') as string)?.toLowerCase().replace(/\s+/g, '_')
    }

    const { error } = await (supabase.from('plans') as any).insert(data)
    if (error) return { error: error.message }

    revalidatePath('/admin-saas/plans')
    return { success: true }
}

export async function getAuditLogs(limit: number = 100) {
    const supabase = await createClient()
    const { data, error } = await (supabase.from('audit_logs') as any)
        .select(`
            *,
            tenants (nome_empresa)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) return []
    return data
}
