import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import {
    Users,
    TrendingUp,
    Calendar,
    Clock,
    ArrowUpRight,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Phone,
    Home
} from "lucide-react"
import Link from "next/link"

async function getDashboardData() {
    const supabase = await createClient()

    // Get leads count
    const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

    // Get new leads (this week)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const { count: newLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString())

    // Get clients count
    const { count: totalClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

    // Get deals count
    const { count: totalDeals } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })

    // Get recent leads
    const { data: recentLeads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    // Get tasks (incomplete)
    const { data: pendingTasks, count: pendingCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('status', 'pendente')
        .order('data_vencimento', { ascending: true })
        .limit(5)

    return {
        stats: {
            totalLeads: totalLeads || 0,
            newLeads: newLeads || 0,
            totalClients: totalClients || 0,
            totalDeals: totalDeals || 0,
            pendingTasks: pendingCount || 0
        },
        recentLeads: recentLeads || [],
        pendingTasks: pendingTasks || []
    }
}

const statusConfig: Record<string, { color: string; bg: string }> = {
    novo: { color: "text-sky-400", bg: "bg-sky-500/10" },
    em_contato: { color: "text-amber-400", bg: "bg-amber-500/10" },
    agendado: { color: "text-violet-400", bg: "bg-violet-500/10" },
    visitou: { color: "text-emerald-400", bg: "bg-emerald-500/10" },
    proposta: { color: "text-rose-400", bg: "bg-rose-500/10" },
}

export default async function DashboardPage() {
    const { stats, recentLeads, pendingTasks } = await getDashboardData()

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                    <p className="text-sm text-zinc-500">Visão geral do seu CRM</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/leads">
                        <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                            <Users className="h-4 w-4 mr-2" />
                            Novo Lead
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Total de Leads</p>
                                <p className="text-3xl font-semibold text-white mt-1">{stats.totalLeads}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                    <span className="text-xs text-emerald-500">+{stats.newLeads} esta semana</span>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-sky-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Clientes</p>
                                <p className="text-3xl font-semibold text-white mt-1">{stats.totalClients}</p>
                                <p className="text-xs text-zinc-500 mt-1">Leads convertidos</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Negócios Ativos</p>
                                <p className="text-3xl font-semibold text-white mt-1">{stats.totalDeals}</p>
                                <p className="text-xs text-zinc-500 mt-1">Em andamento</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-violet-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Tarefas Pendentes</p>
                                <p className="text-3xl font-semibold text-white mt-1">{stats.pendingTasks}</p>
                                <p className="text-xs text-amber-500 mt-1">Requerem atenção</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Recent Leads */}
                <Card className="col-span-2 bg-zinc-900/50 border-zinc-800/50">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-zinc-400">Últimos Leads</CardTitle>
                            <Link href="/leads" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                                Ver todos <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentLeads.length > 0 ? (
                            <div className="space-y-3">
                                {recentLeads.map((lead: any) => {
                                    const status = statusConfig[lead.status] || statusConfig.novo
                                    return (
                                        <Link
                                            key={lead.id}
                                            href={`/leads?selected=${lead.id}`}
                                            className="flex items-center justify-between py-2 px-3 -mx-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center">
                                                    <span className="text-xs font-semibold text-zinc-400">
                                                        {lead.name?.substring(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{lead.name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                        <Phone className="h-3 w-3" />
                                                        <span>{lead.phone || 'Sem telefone'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={`${status.bg} ${status.color} border-0 text-xs`}>
                                                    {lead.status?.replace('_', ' ')}
                                                </Badge>
                                                <span className="text-[10px] text-zinc-600">
                                                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <Users className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                                <p className="text-sm text-zinc-500">Nenhum lead ainda</p>
                                <Link href="/leads" className="text-xs text-sky-500 hover:underline mt-1 inline-block">
                                    Adicionar primeiro lead
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pending Tasks */}
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-zinc-400">Tarefas Pendentes</CardTitle>
                            <Link href="/tarefas" className="text-xs text-zinc-500 hover:text-white transition-colors">
                                Ver todas →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pendingTasks.length > 0 ? (
                            <div className="space-y-3">
                                {pendingTasks.map((task: any) => (
                                    <div key={task.id} className="flex items-start gap-3 py-2">
                                        <div className="h-5 w-5 rounded border border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">{task.titulo}</p>
                                            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                                <Clock className="h-3 w-3" />
                                                {task.data_vencimento
                                                    ? new Date(task.data_vencimento).toLocaleDateString('pt-BR')
                                                    : 'Sem prazo'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <CheckCircle className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                                <p className="text-sm text-zinc-500">Nenhuma tarefa pendente</p>
                                <p className="text-xs text-zinc-600">Você está em dia!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Ações Rápidas</h3>
                <div className="grid grid-cols-4 gap-3">
                    <Link href="/leads" className="group">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all">
                            <div className="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                                <Users className="h-5 w-5 text-sky-400" />
                            </div>
                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Novo Lead</span>
                        </div>
                    </Link>
                    <Link href="/agenda/nova" className="group">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                <Calendar className="h-5 w-5 text-emerald-400" />
                            </div>
                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Agendar Visita</span>
                        </div>
                    </Link>
                    <Link href="/imoveis/novo" className="group">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all">
                            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                                <Home className="h-5 w-5 text-violet-400" />
                            </div>
                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Novo Imóvel</span>
                        </div>
                    </Link>
                    <Link href="/negocios/novo" className="group">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                <TrendingUp className="h-5 w-5 text-amber-400" />
                            </div>
                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Nova Negociação</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
