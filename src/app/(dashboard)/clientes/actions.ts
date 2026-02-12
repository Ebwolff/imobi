'use server'

import { createClient as createSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getClients() {
    const supabase = await createSupabaseClient()

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error loading clients:", error)
        return []
    }

    return data || []
}

export async function getClientById(id: string) {
    const supabase = await createSupabaseClient()

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error loading client:", error)
        return null
    }

    return data
}

export async function createClientRecord(formData: FormData) {
    const supabase = await createSupabaseClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
        return { error: "Não autenticado" }
    }

    const clientData = {
        user_id: userData.user.id,
        nome: formData.get('nome') as string,
        email: formData.get('email') as string || null,
        telefone: formData.get('telefone') as string || null,
        cpf: formData.get('cpf') as string || null,
        tipo: formData.get('tipo') as string || 'comprador',
        endereco: formData.get('endereco') as string || null,
        bairro: formData.get('bairro') as string || null,
        cidade: formData.get('cidade') as string || null,
        estado: formData.get('estado') as string || 'SP',
        observacoes: formData.get('observacoes') as string || null,
        lead_id: formData.get('lead_id') as string || null,
    }

    // @ts-ignore
    const { error } = await supabase.from('clients').insert(clientData)

    if (error) {
        console.error("Error creating client:", error)
        return { error: "Erro ao cadastrar cliente" }
    }

    revalidatePath('/clientes')
    return { success: true }
}

export async function updateClientRecord(id: string, formData: FormData) {
    const supabase = await createSupabaseClient()

    const clientData = {
        nome: formData.get('nome') as string,
        email: formData.get('email') as string || null,
        telefone: formData.get('telefone') as string || null,
        cpf: formData.get('cpf') as string || null,
        tipo: formData.get('tipo') as string,
        endereco: formData.get('endereco') as string || null,
        bairro: formData.get('bairro') as string || null,
        cidade: formData.get('cidade') as string || null,
        estado: formData.get('estado') as string,
        observacoes: formData.get('observacoes') as string || null,
        ativo: formData.get('ativo') === 'true',
    }

    // @ts-ignore
    const { error } = await supabase.from('clients').update(clientData).eq('id', id)

    if (error) {
        console.error("Error updating client:", error)
        return { error: "Erro ao atualizar cliente" }
    }

    revalidatePath('/clientes')
    return { success: true }
}

export async function deleteClientRecord(id: string) {
    const supabase = await createSupabaseClient()

    // @ts-ignore
    const { error } = await supabase.from('clients').delete().eq('id', id)

    if (error) {
        console.error("Error deleting client:", error)
        return { error: "Erro ao excluir cliente" }
    }

    revalidatePath('/clientes')
    return { success: true }
}

// Convert a lead to client
export async function convertLeadToClient(leadId: string) {
    const supabase = await createSupabaseClient()

    // Get lead data
    const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

    const lead = leadData as any

    if (leadError || !lead) {
        return { error: "Lead não encontrado" }
    }

    const { data: userData } = await supabase.auth.getUser()

    // Create client from lead
    // @ts-ignore
    const { error } = await supabase.from('clients').insert({
        user_id: userData?.user?.id || null,
        lead_id: leadId,
        nome: (lead as any).name,
        email: (lead as any).email,
        telefone: (lead as any).phone,
        tipo: 'comprador',
    })

    if (error) {
        console.error("Error converting lead:", error)
        return { error: "Erro ao converter lead" }
    }

    revalidatePath('/clientes')
    return { success: true }
}
