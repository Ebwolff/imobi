'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginSaas(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: 'E-mail ou senha inválidos.' }
    }

    // After login, the middleware will handle access verification
    redirect('/admin-saas')
}

export async function logoutSaas() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin-saas/login')
}
