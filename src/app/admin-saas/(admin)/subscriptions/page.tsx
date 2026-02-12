import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import {
    CreditCard,
    Building2,
    Calendar,
    CheckCircle,
    AlertTriangle,
    Clock,
    ChevronRight
} from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    ativa: { label: "Ativa", color: "text-emerald-500", dot: "bg-emerald-500" },
    trial: { label: "Trial", color: "text-sky-500", dot: "bg-sky-500" },
    inadimplente: { label: "Inadimplente", color: "text-amber-500", dot: "bg-amber-500" },
    cancelada: { label: "Cancelada", color: "text-zinc-500", dot: "bg-zinc-500" },
    expirada: { label: "Expirada", color: "text-rose-500", dot: "bg-rose-500" },
}

async function getSubscriptions() {
    const supabase = await createClient()

    // @ts-ignore
    const { data, error } = await supabase
        .from('subscriptions')
        .select(`
            *,
            tenants (id, nome_empresa, email_principal),
            plans (nome, slug, valor_mensal)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error loading subscriptions:", error)
        return []
    }

    return data || []
}

export default async function SubscriptionsPage() {
    const subscriptions = await getSubscriptions()

    // Stats
    const active = subscriptions.filter((s: any) => s.status === 'ativa').length
    const trial = subscriptions.filter((s: any) => s.status === 'trial').length
    const overdue = subscriptions.filter((s: any) => s.status === 'inadimplente').length

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">Assinaturas</h1>
                <p className="text-sm text-zinc-500">Gerencie as assinaturas dos clientes</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
                <span className="text-zinc-500">
                    <span className="text-white font-medium">{subscriptions.length}</span> total
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                    <span className="text-emerald-500 font-medium">{active}</span> ativas
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                    <span className="text-sky-500 font-medium">{trial}</span> em trial
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                    <span className="text-amber-500 font-medium">{overdue}</span> inadimplentes
                </span>
            </div>

            {/* Table */}
            <Card className="bg-zinc-900/30 border-zinc-800/50 overflow-hidden">
                <CardContent className="p-0">
                    {subscriptions.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                                    <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Plano
                                    </th>
                                    <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Valor
                                    </th>
                                    <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Início
                                    </th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/30">
                                {subscriptions.map((sub: any) => {
                                    const status = statusConfig[sub.status] || statusConfig.ativa
                                    return (
                                        <tr
                                            key={sub.id}
                                            className="hover:bg-zinc-800/20 transition-colors group"
                                        >
                                            <td className="p-4">
                                                <Link
                                                    href={`/admin-saas/tenants/${sub.tenants?.id}`}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center">
                                                        <Building2 className="h-4 w-4 text-zinc-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                                                            {sub.tenants?.nome_empresa || 'N/A'}
                                                        </p>
                                                        <p className="text-xs text-zinc-500">{sub.tenants?.email_principal}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <Badge className="bg-zinc-800 text-zinc-300 text-xs">
                                                    {sub.plans?.nome || 'N/A'}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${status.dot}`} />
                                                    <span className={`text-sm ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm text-white font-medium">
                                                    R$ {sub.valor || sub.plans?.valor_mensal || 0}
                                                </span>
                                                <span className="text-xs text-zinc-500">/mês</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm text-zinc-500">
                                                    {sub.data_inicio ? new Date(sub.data_inicio).toLocaleDateString('pt-BR') : '-'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-16 text-center">
                            <CreditCard className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-sm font-medium text-white mb-1">Nenhuma assinatura</h3>
                            <p className="text-xs text-zinc-500">As assinaturas dos clientes aparecerão aqui</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
