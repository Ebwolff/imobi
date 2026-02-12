import { createClient } from "@/lib/supabase/server"
import { checkSaaSAdmin } from "../actions"

export default async function DebugAuthPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let saasUser = null
    let error = null

    if (user) {
        const result = await (supabase.from('saas_users') as any)
            .select('*')
            .eq('id', user.id)
            .single()
        saasUser = result.data
        error = result.error
    }

    return (
        <div className="p-10 font-mono text-sm text-zinc-400 bg-zinc-950 min-h-screen">
            <h1 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-b border-zinc-800 pb-2">
                Auth Diagnostics
            </h1>

            <div className="space-y-4">
                <section>
                    <h2 className="text-amber-500 font-semibold mb-2">1. Session Info</h2>
                    <pre className="bg-zinc-900 p-4 rounded border border-zinc-800 overflow-auto">
                        {JSON.stringify({
                            id: user?.id,
                            email: user?.email,
                            role: user?.role,
                            aud: user?.aud
                        }, null, 2)}
                    </pre>
                </section>

                <section>
                    <h2 className="text-amber-500 font-semibold mb-2">2. SaaS Admin Status</h2>
                    <pre className="bg-zinc-900 p-4 rounded border border-zinc-800 overflow-auto">
                        {JSON.stringify({
                            found_in_saas_users: !!saasUser,
                            role: saasUser?.role,
                            nome: saasUser?.nome,
                            ativo: saasUser?.ativo,
                            error: error ? {
                                message: error.message,
                                code: error.code
                            } : null
                        }, null, 2)}
                    </pre>
                </section>

                <section>
                    <h2 className="text-amber-500 font-semibold mb-2">3. Environments Check</h2>
                    <pre className="bg-zinc-900 p-4 rounded border border-zinc-800">
                        {JSON.stringify({
                            url_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                            url: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0] + '... (id)',
                        }, null, 2)}
                    </pre>
                </section>
            </div>

            <div className="mt-8 text-[10px] text-zinc-600">
                Generated at: {new Date().toISOString()}
            </div>
        </div>
    )
}
