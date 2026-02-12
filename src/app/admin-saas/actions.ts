'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function checkSaaSAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin-saas/login')
    }

    // Check if user is in saas_users with correct role
    const { data: saasUser, error } = await (supabase.from('saas_users') as any)
        .select('role')
        .eq('id', user.id)
        .single()

    if (error || !saasUser || !['owner', 'admin_saas', 'suporte'].includes(saasUser.role)) {
        console.error("SaaS Admin Check Failed:", {
            userId: user.id,
            email: user.email,
            found: !!saasUser,
            role: saasUser?.role,
            dbError: error
        })
        // If not a global admin, redirect to CRM main page
        redirect('/')
    }

    return user
}

// =============================================
// TENANT MANAGEMENT (Admin Only)
// =============================================

export async function getAllTenants() {
    const supabase = await createClient()

    // @ts-ignore
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

    if (error) {
        console.error("Error loading tenants:", error)
        return []
    }

    return data || []
}

export async function getTenantById(id: string) {
    const supabase = await createClient()

    // @ts-ignore
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

    if (error) {
        console.error("Error loading tenant:", error)
        return null
    }

    return data
}

export async function getTenantStats() {
    const supabase = await createClient()

    // @ts-ignore
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

    if (error) throw error

    revalidatePath('/admin-saas/tenants')
    revalidatePath(`/admin-saas/tenants/${id}`)
}

export async function createTenant(data: any) {
    const supabase = await createClient()

    const { data: tenant, error } = await (supabase.from('tenants') as any)
        .insert(data)
        .select()
        .single()

    if (error) throw error

    revalidatePath('/admin-saas/tenants')
    return tenant
}

// =============================================
// SUBSCRIPTIONS & PLANS
// =============================================

export async function getPlans() {
    const supabase = await createClient()
    const { data, error } = await (supabase.from('plans') as any).select('*').order('valor_mensal', { ascending: true })
    if (error) return []
    return data
}

export async function createPlan(data: any) {
    const supabase = await createClient()
    const { error } = await (supabase.from('plans') as any).insert(data)
    if (error) throw error
    revalidatePath('/admin-saas/plans')
}

// =============================================
// AUDIT LOGS
// =============================================

export async function getAuditLogs() {
    const supabase = await createClient()
    // @ts-ignore
    const { data, error } = await (supabase.from('audit_logs') as any)
        .select(`
            *,
            tenants (nome_empresa)
        `)
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) return []
    return data
}
