import { createClient } from "@/lib/supabase/server"

/**
 * Get current user's tenant_id from their profile
 * This is the central function for multi-tenant isolation
 */
export async function getCurrentTenantId(): Promise<string | null> {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return null

    // @ts-ignore - tenant_id column exists but types not regenerated
    const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', userData.user.id)
        .single()

    // @ts-ignore
    return profile?.tenant_id || null
}

/**
 * Get current user's role
 */
export async function getCurrentUserRole(): Promise<string | null> {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return null

    // @ts-ignore - role column exists but types not regenerated
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userData.user.id)
        .single()

    // @ts-ignore
    return profile?.role || 'corretor'
}

/**
 * Check if current user is admin or gestor
 */
export async function canManageTeam(): Promise<boolean> {
    const role = await getCurrentUserRole()
    return role === 'admin' || role === 'gestor'
}
