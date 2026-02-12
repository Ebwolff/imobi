'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getDeals() {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await (supabase.from('deals') as any)
        .select(`
            *,
            client:clients(id, nome),
            property:properties(id, titulo, valor),
            user:profiles(id, full_name)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error loading deals:", error)
        return []
    }

    return data || []
}

export async function getDealById(id: string) {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await (supabase.from('deals') as any)
        .select(`
            *,
            client:clients(*),
            property:properties(*),
            user:profiles(id, full_name)
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error loading deal:", error)
        return null
    }

    return data
}

export async function createDeal(formData: FormData) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
        return { error: "Não autenticado" }
    }

    const valorProposta = formData.get('valor_proposta') ? Number(formData.get('valor_proposta')) : null
    const comissaoPerc = formData.get('comissao_percentual') ? Number(formData.get('comissao_percentual')) : 6.0
    const comissaoValor = valorProposta ? valorProposta * (comissaoPerc / 100) : null

    const dealData = {
        user_id: userData.user.id,
        titulo: formData.get('titulo') as string,
        tipo: formData.get('tipo') as string || 'venda',
        client_id: formData.get('client_id') as string || null,
        property_id: formData.get('property_id') as string || null,
        valor_proposta: valorProposta,
        comissao_percentual: comissaoPerc,
        comissao_valor: comissaoValor,
        status: 'aberta',
        data_prevista_fechamento: formData.get('data_prevista_fechamento') as string || null,
        observacoes: formData.get('observacoes') as string || null,
    }

    // @ts-ignore
    const { error } = await (supabase.from('deals') as any).insert(dealData)

    if (error) {
        console.error("Error creating deal:", error)
        return { error: "Erro ao criar negociação" }
    }

    revalidatePath('/negocios')
    return { success: true }
}

export async function updateDealStatus(id: string, status: string, motivoPerda?: string) {
    const supabase = await createClient()

    const updateData: any = { status }

    if (status === 'fechada_ganha') {
        updateData.data_fechamento = new Date().toISOString().split('T')[0]
    }

    if (status === 'fechada_perdida' && motivoPerda) {
        updateData.motivo_perda = motivoPerda
        updateData.data_fechamento = new Date().toISOString().split('T')[0]
    }

    // @ts-ignore
    const { error } = await (supabase.from('deals') as any).update(updateData).eq('id', id)

    if (error) {
        console.error("Error updating deal:", error)
        return { error: "Erro ao atualizar negociação" }
    }

    revalidatePath('/negocios')
    return { success: true }
}

export async function deleteDeal(id: string) {
    const supabase = await createClient()

    // @ts-ignore
    const { error } = await (supabase.from('deals') as any).delete().eq('id', id)

    if (error) {
        console.error("Error deleting deal:", error)
        return { error: "Erro ao excluir negociação" }
    }

    revalidatePath('/negocios')
    return { success: true }
}

// Get dropdown options for forms
export async function getClientsForSelect() {
    const supabase = await createClient()
    const { data } = await supabase.from('clients').select('id, nome').order('nome')
    return data || []
}

export async function getPropertiesForSelect() {
    const supabase = await createClient()
    const { data } = await supabase.from('properties').select('id, titulo, valor').eq('status', 'disponivel').order('titulo')
    return data || []
}
