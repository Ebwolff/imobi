import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse(
                "<html><body><h1>VOCÊ NÃO ESTÁ LOGADO!</h1><p>Por favor, faça login em <a href='/auth/login'>/auth/login</a> primeiro e depois volte aqui.</p></body></html>",
                { headers: { 'Content-Type': 'text/html' } }
            )
        }

        return NextResponse.json({
            message: "UUID CAPTURADO COM SUCESSO!",
            real_uuid: user.id,
            email: user.email,
            instruction: "Mande o print desta tela para o assistente."
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
