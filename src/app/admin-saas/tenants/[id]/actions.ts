'use server'

import { createClient } from "@/lib/supabase/server"

/**
 * Get detailed stats for a specific tenant
 * This connects Admin Panel to Tenant CRM data
 */
export async function getTenantDetails(tenantId: string) {
    const supabase = await createClient()

    // @ts-ignore - Get tenant basic info
    const { data: tenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single()

    if (!tenant) return null

    // @ts-ignore - Count users in this tenant
    const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)

    // @ts-ignore - Count leads in this tenant
    const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)

    // @ts-ignore - Count clients in this tenant
    const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)

    // @ts-ignore - Count properties in this tenant
    const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)

    // @ts-ignore - Count deals in this tenant
    const { count: dealsCount } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)

    // @ts-ignore - Get subscription info
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*, plans(nome, valor_mensal)')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    // @ts-ignore - Get recent activity (last 5 leads)
    const { data: recentLeads } = await supabase
        .from('leads')
        .select('id, name, created_at')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        ...tenant,
        stats: {
            users: usersCount || 0,
            leads: leadsCount || 0,
            clients: clientsCount || 0,
            properties: propertiesCount || 0,
            deals: dealsCount || 0,
        },
        subscription,
        recentLeads: recentLeads || []
    }
}
