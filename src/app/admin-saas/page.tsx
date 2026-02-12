import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import {
    Building2,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Loader2
} from "lucide-react"
import Link from "next/link"

async function getDashboardStats() {
    const supabase = await createClient()

    // @ts-ignore
    const { data: tenants } = await supabase
        .from('tenants')
        .select('id, status, created_at')

    // @ts-ignore
    const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)

    const total = tenants?.length || 0
    const active = tenants?.filter((t: any) => t.status === 'ativo').length || 0
    const newThisMonth = tenants?.filter((t: any) =>
        new Date(t.created_at) >= firstDay
    ).length || 0

    // Mock MRR calculation (would come from subscriptions)
    const mrr = active * 147 // avg plan price

    return {
        totalTenants: total,
        activeTenants: active,
        newThisMonth,
        mrr,
        mrrGrowth: 12.5,
        churnRate: 2.3,
        totalLeads: totalLeads || 0,
        avgLeadsPerTenant: total > 0 ? Math.round((totalLeads || 0) / total) : 0
    }
}

async function getRecentTenants() {
    const supabase = await createClient()

    // @ts-ignore
    const { data } = await supabase
        .from('tenants')
        .select('id, nome_empresa, plano, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    return data || []
}

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats()
    const recentTenants = await getRecentTenants()

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                <p className="text-sm text-zinc-500">Visão geral da plataforma</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                {/* Tenants Ativos */}
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Clientes Ativos</p>
                                <p className="text-3xl font-semibold text-white mt-1">{stats.activeTenants}</p>
                                <p className="text-xs text-zinc-500 mt-1">de {stats.totalTenants} total</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-emerald-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Novos este Mês */}
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Novos este Mês</p>
                                <p className="text-3xl font-semibold text-white mt-1">+{stats.newThisMonth}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                    <span className="text-xs text-emerald-500">23% vs mês anterior</span>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-sky-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* MRR */}
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">MRR</p>
                                <p className="text-3xl font-semibold text-white mt-1">
                                    R$ {stats.mrr.toLocaleString('pt-BR')}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                    <span className="text-xs text-emerald-500">+{stats.mrrGrowth}%</span>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-violet-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Churn */}
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Churn Rate</p>
                                <p className="text-3xl font-semibold text-white mt-1">{stats.churnRate}%</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                                    <span className="text-xs text-emerald-500">-0.5% vs mês anterior</span>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <TrendingDown className="h-5 w-5 text-amber-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5 text-zinc-500" />
                                <div>
                                    <p className="text-sm font-medium text-white">Leads Processados</p>
                                    <p className="text-xs text-zinc-500">Volume total na plataforma</p>
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-white">
                                {stats.totalLeads.toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-zinc-500" />
                                <div>
                                    <p className="text-sm font-medium text-white">Média por Cliente</p>
                                    <p className="text-xs text-zinc-500">Leads por tenant</p>
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-white">{stats.avgLeadsPerTenant}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Tenants */}
            <Card className="bg-zinc-900/50 border-zinc-800/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-zinc-400">Últimos Clientes</CardTitle>
                        <Link href="/admin-saas/tenants" className="text-xs text-zinc-500 hover:text-white transition-colors">
                            Ver todos →
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentTenants.length > 0 ? (
                        <div className="space-y-3">
                            {recentTenants.map((tenant: any) => (
                                <Link
                                    key={tenant.id}
                                    href={`/admin-saas/tenants/${tenant.id}`}
                                    className="flex items-center justify-between py-2 px-3 -mx-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center">
                                            <Building2 className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{tenant.nome_empresa}</p>
                                            <p className="text-xs text-zinc-500">
                                                {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-xs">
                                            {tenant.plano}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className={
                                                tenant.status === 'ativo'
                                                    ? 'border-emerald-500/30 text-emerald-500 text-xs'
                                                    : 'border-zinc-600 text-zinc-500 text-xs'
                                            }
                                        >
                                            {tenant.status}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <Building2 className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                            <p className="text-sm text-zinc-500">Nenhum cliente cadastrado ainda</p>
                            <Link href="/admin-saas/tenants/novo" className="text-xs text-emerald-500 hover:underline mt-1 inline-block">
                                Cadastrar primeiro cliente
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
