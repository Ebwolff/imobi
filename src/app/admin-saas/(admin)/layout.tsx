import { checkSaaSAdmin } from "@/app/admin-saas/actions"
import AdminLayoutClient from "@/app/admin-saas/AdminLayoutClient"
import React from 'react'

export default async function AdminSaasLayout({ children }: { children: React.ReactNode }) {
    // 1. Security Check
    const result = await checkSaaSAdmin()

    // 2. Error Display (Debug Mode)
    if ('isError' in result) {
        return (
            <div className="p-10 bg-zinc-950 min-h-screen text-red-500 font-mono">
                <div className="max-w-4xl mx-auto border border-red-900/50 rounded-xl overflow-hidden shadow-2xl shadow-red-950/20">
                    <div className="bg-red-950/20 p-6 border-b border-red-900/50 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <h1 className="text-xl font-bold text-red-500 uppercase tracking-widest">ACCESS DENIED - DEBUG MODE</h1>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
                            <h2 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4 font-bold">Technical Data</h2>
                            <pre className="text-xs text-zinc-400 overflow-auto max-h-[400px]">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>

                        <div className="p-4 bg-amber-950/10 border border-amber-900/30 rounded-lg">
                            <p className="text-amber-500 text-xs leading-relaxed">
                                <strong className="block mb-1">Dica do Desenvolvedor:</strong>
                                Verifique se o banco de dados remoto possui a tabela `saas_users`.
                                Se o erro for "PGRST205", a tabela ainda não foi criada no Supabase (o push falhou).
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 p-4 text-[10px] text-zinc-600 text-center border-t border-zinc-800">
                        Diagnostics generated at {new Date().toISOString()}
                    </div>
                </div>
            </div>
        )
    }

    const { user } = result

    return (
        <AdminLayoutClient userEmail={user.email}>
            {children}
        </AdminLayoutClient>
    )
}
