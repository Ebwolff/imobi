'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getVisits() {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await (supabase.from('visits') as any)
        .select(`
            *,
            client:clients(id, nome),
            property:properties(id, titulo, endereco, cidade),
            user:profiles(id, full_name)
        `)
        .order('data_visita', { ascending: true })

    if (error) {
        console.error("Error loading visits:", error)
        return []
    }

    return data || []
}

export async function createVisit(formData: FormData) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
        return { error: "Não autenticado" }
    }

    const visitData = {
        user_id: userData.user.id,
        client_id: formData.get('client_id') as string || null,
        property_id: formData.get('property_id') as string || null,
        data_visita: formData.get('data_visita') as string,
        duracao_minutos: formData.get('duracao_minutos') ? Number(formData.get('duracao_minutos')) : 60,
        observacoes: formData.get('observacoes') as string || null,
        status: 'agendada',
    }

    // @ts-ignore
    const { error } = await (supabase.from('visits') as any).insert(visitData)

    if (error) {
        console.error("Error creating visit:", error)
        return { error: "Erro ao agendar visita" }
    }

    revalidatePath('/agenda')
    return { success: true }
}

export async function updateVisitStatus(id: string, status: string, feedback?: string) {
    const supabase = await createClient()

    const updateData: any = { status }
    if (feedback) updateData.feedback = feedback

    // @ts-ignore
    const { error } = await (supabase.from('visits') as any).update(updateData).eq('id', id)

    if (error) {
        console.error("Error updating visit:", error)
        return { error: "Erro ao atualizar visita" }
    }

    revalidatePath('/agenda')
    return { success: true }
}

export async function deleteVisit(id: string) {
    const supabase = await createClient()

    // @ts-ignore
    const { error } = await (supabase.from('visits') as any).delete().eq('id', id)

    if (error) {
        console.error("Error deleting visit:", error)
        return { error: "Erro ao excluir visita" }
    }

    revalidatePath('/agenda')
    return { success: true }
}
