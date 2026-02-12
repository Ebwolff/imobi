import { checkSaaSAdmin } from "@/app/admin-saas/actions"
import AdminLayoutClient from "@/app/admin-saas/AdminLayoutClient"
import React from 'react'

export default async function AdminSaasLayout({ children }: { children: React.ReactNode }) {
    // 1. Mandatory Security Check
    const result = await checkSaaSAdmin()

    // 2. Error Display (Debug Mode)
    if ('isError' in result) {
        return (
            <div className="p-10 bg-[#050505] min-h-screen text-red-500 font-mono">
                <div className="max-w-4xl mx-auto border border-red-900/30 rounded-2xl overflow-hidden bg-black shadow-2xl shadow-red-950/20">
                    <div className="bg-red-950/10 p-6 border-b border-red-900/30 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <h1 className="text-xl font-bold text-red-500 tracking-tight">ACCESS DENIED_DIAGNOSTICS</h1>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">User Status</span>
                                <div className="text-sm text-zinc-300">
                                    Email: {result.data.email || 'None'}<br />
                                    ID: <span className="text-[10px] opacity-50">{result.data.userId || 'None'}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">DB Record</span>
                                <div className="text-sm text-zinc-300">
                                    Found: {String(result.data.found)}<br />
                                    Role: {result.data.role || 'None'}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-950 rounded-xl border border-zinc-900 overflow-auto max-h-[300px]">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold block mb-4">PostgREST Response</span>
                            <pre className="text-xs text-zinc-500 leading-relaxed font-mono">
                                {JSON.stringify(result.data.dbError, null, 2)}
                            </pre>
                        </div>
                    </div>

                    <div className="p-4 bg-red-950/5 text-center border-t border-red-900/20">
                        <p className="text-[10px] text-red-900/60 uppercase tracking-[0.3em]">System Version: 2.0.4 - Secure Layer</p>
                    </div>
                </div>
            </div>
        )
    }

    const { user } = result

    // @ts-ignore - The user returned by checkSaaSAdmin is the auth user
    return (
        <AdminLayoutClient userEmail={user.email}>
            {children}
        </AdminLayoutClient>
    )
}
