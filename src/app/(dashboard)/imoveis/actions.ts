'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProperties() {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await (supabase.from('properties') as any)
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error loading properties:", error)
        return []
    }

    return data || []
}

export async function getPropertyById(id: string) {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await (supabase.from('properties') as any)
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error loading property:", error)
        return null
    }

    return data
}

export async function createProperty(formData: FormData) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
        return { error: "Não autenticado" }
    }

    const propertyData = {
        user_id: userData.user.id,
        titulo: formData.get('titulo') as string,
        tipo: formData.get('tipo') as string,
        finalidade: formData.get('finalidade') as string || 'venda',
        endereco: formData.get('endereco') as string || null,
        bairro: formData.get('bairro') as string || null,
        cidade: formData.get('cidade') as string,
        estado: formData.get('estado') as string || 'SP',
        area_total: formData.get('area_total') ? Number(formData.get('area_total')) : null,
        quartos: formData.get('quartos') ? Number(formData.get('quartos')) : 0,
        banheiros: formData.get('banheiros') ? Number(formData.get('banheiros')) : 0,
        vagas: formData.get('vagas') ? Number(formData.get('vagas')) : 0,
        valor: Number(formData.get('valor')),
        descricao: formData.get('descricao') as string || null,
        status: 'disponivel'
    }

    // @ts-ignore
    const { error } = await (supabase.from('properties') as any).insert(propertyData)

    if (error) {
        console.error("Error creating property:", error)
        return { error: "Erro ao cadastrar imóvel" }
    }

    revalidatePath('/imoveis')
    return { success: true }
}

export async function updateProperty(id: string, formData: FormData) {
    const supabase = await createClient()

    const propertyData = {
        titulo: formData.get('titulo') as string,
        tipo: formData.get('tipo') as string,
        finalidade: formData.get('finalidade') as string,
        endereco: formData.get('endereco') as string || null,
        bairro: formData.get('bairro') as string || null,
        cidade: formData.get('cidade') as string,
        estado: formData.get('estado') as string,
        area_total: formData.get('area_total') ? Number(formData.get('area_total')) : null,
        quartos: formData.get('quartos') ? Number(formData.get('quartos')) : 0,
        banheiros: formData.get('banheiros') ? Number(formData.get('banheiros')) : 0,
        vagas: formData.get('vagas') ? Number(formData.get('vagas')) : 0,
        valor: Number(formData.get('valor')),
        descricao: formData.get('descricao') as string || null,
        status: formData.get('status') as string,
    }

    // @ts-ignore
    const { error } = await (supabase.from('properties') as any).update(propertyData).eq('id', id)

    if (error) {
        console.error("Error updating property:", error)
        return { error: "Erro ao atualizar imóvel" }
    }

    revalidatePath('/imoveis')
    return { success: true }
}

export async function deleteProperty(id: string) {
    const supabase = await createClient()

    // @ts-ignore
    const { error } = await (supabase.from('properties') as any).delete().eq('id', id)

    if (error) {
        console.error("Error deleting property:", error)
        return { error: "Erro ao excluir imóvel" }
    }

    revalidatePath('/imoveis')
    return { success: true }
}
