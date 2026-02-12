'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTasks(filter?: 'all' | 'today' | 'overdue' | 'pending') {
    const supabase = await createClient()

    let query = supabase
        .from('tasks')
        .select(`
            *,
            client:clients(id, nome),
            lead:leads(id, name),
            deal:deals(id, titulo),
            user:profiles(id, full_name)
        `)
        .order('data_vencimento', { ascending: true })

    if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0]
        query = query.gte('data_vencimento', today).lt('data_vencimento', today + 'T23:59:59')
    } else if (filter === 'overdue') {
        query = query.lt('data_vencimento', new Date().toISOString()).eq('status', 'pendente')
    } else if (filter === 'pending') {
        query = query.in('status', ['pendente', 'em_andamento'])
    }

    const { data, error } = await query

    if (error) {
        console.error("Error loading tasks:", error)
        return []
    }

    return data || []
}

export async function createTask(formData: FormData) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
        return { error: "Não autenticado" }
    }

    const taskData = {
        user_id: userData.user.id,
        titulo: formData.get('titulo') as string,
        descricao: formData.get('descricao') as string || null,
        tipo: formData.get('tipo') as string || 'ligacao',
        prioridade: formData.get('prioridade') as string || 'media',
        data_vencimento: formData.get('data_vencimento') as string || null,
        lead_id: formData.get('lead_id') as string || null,
        client_id: formData.get('client_id') as string || null,
        deal_id: formData.get('deal_id') as string || null,
        status: 'pendente',
    }

    // @ts-ignore
    const { error } = await supabase.from('tasks').insert(taskData)

    if (error) {
        console.error("Error creating task:", error)
        return { error: "Erro ao criar tarefa" }
    }

    revalidatePath('/tarefas')
    return { success: true }
}

export async function completeTask(id: string) {
    const supabase = await createClient()

    // @ts-ignore
    const { error } = await supabase.from('tasks').update({
        status: 'concluida',
        data_conclusao: new Date().toISOString()
    }).eq('id', id)

    if (error) {
        console.error("Error completing task:", error)
        return { error: "Erro ao concluir tarefa" }
    }

    revalidatePath('/tarefas')
    return { success: true }
}

export async function deleteTask(id: string) {
    const supabase = await createClient()

    // @ts-ignore
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
        console.error("Error deleting task:", error)
        return { error: "Erro ao excluir tarefa" }
    }

    revalidatePath('/tarefas')
    return { success: true }
}
