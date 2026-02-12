import { getDeals } from "./actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, TrendingUp, DollarSign, Calendar, Building2, User, ChevronRight } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string, color: string, dot: string }> = {
    aberta: { label: "Aberta", color: "text-sky-400", dot: "bg-sky-500" },
    negociando: { label: "Negociando", color: "text-amber-400", dot: "bg-amber-500" },
    proposta: { label: "Proposta", color: "text-violet-400", dot: "bg-violet-500" },
    fechada_ganha: { label: "Fechada", color: "text-emerald-400", dot: "bg-emerald-500" },
    fechada_perdida: { label: "Perdida", color: "text-rose-400", dot: "bg-rose-500" },
    cancelada: { label: "Cancelada", color: "text-zinc-400", dot: "bg-zinc-500" },
}

export default async function NegociosPage() {
    const deals = await getDeals()

    const totalAberto = deals.filter((d: any) => ['aberta', 'negociando', 'proposta'].includes(d.status))
        .reduce((sum: number, d: any) => sum + (d.valor_proposta || 0), 0)
    const totalGanho = deals.filter((d: any) => d.status === 'fechada_ganha')
        .reduce((sum: number, d: any) => sum + (d.valor_final || d.valor_proposta || 0), 0)
    const conversionRate = deals.length ? Math.round((deals.filter((d: any) => d.status === 'fechada_ganha').length / deals.length) * 100) : 0

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Negociações</h1>
                    <p className="text-sm text-zinc-500">Acompanhe suas vendas e locações</p>
                </div>
                <Link href="/negocios/novo">
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Negociação
                    </Button>
                </Link>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <p className="text-sm font-medium text-zinc-400">Em Aberto</p>
                        <p className="text-2xl font-semibold text-sky-400 mt-1">
                            R$ {(totalAberto / 1000).toFixed(0)}k
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">Pipeline ativo</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <p className="text-sm font-medium text-zinc-400">Ganho (Mês)</p>
                        <p className="text-2xl font-semibold text-emerald-400 mt-1">
                            R$ {(totalGanho / 1000).toFixed(0)}k
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">Fechamentos</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <p className="text-sm font-medium text-zinc-400">Total Negócios</p>
                        <p className="text-2xl font-semibold text-white mt-1">{deals.length}</p>
                        <p className="text-xs text-zinc-500 mt-1">Ativos</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <p className="text-sm font-medium text-zinc-400">Taxa Conversão</p>
                        <p className="text-2xl font-semibold text-amber-400 mt-1">{conversionRate}%</p>
                        <p className="text-xs text-zinc-500 mt-1">Win rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Buscar negócio..."
                        className="pl-9 h-9 bg-zinc-900/50 border-zinc-800"
                    />
                </div>
                <Button variant="outline" size="sm" className="h-9 border-zinc-800 text-zinc-400">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                </Button>
            </div>

            {/* List */}
            {deals.length === 0 ? (
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardContent className="py-16 text-center">
                        <TrendingUp className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-sm font-medium text-white mb-1">Nenhuma negociação</h3>
                        <p className="text-xs text-zinc-500 mb-4">Crie sua primeira negociação</p>
                        <Link href="/negocios/novo">
                            <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Negociação
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-zinc-900/30 border-zinc-800/50 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-800/30">
                            {deals.map((deal: any) => {
                                const statusInfo = statusConfig[deal.status] || statusConfig.aberta
                                return (
                                    <Link
                                        key={deal.id}
                                        href={`/negocios/${deal.id}`}
                                        className="flex items-center gap-4 p-4 hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        {/* Icon */}
                                        <div className="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                                            <TrendingUp className="h-5 w-5 text-sky-400" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-white group-hover:text-sky-400 transition-colors truncate">
                                                    {deal.titulo}
                                                </h3>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-2 w-2 rounded-full ${statusInfo.dot}`} />
                                                    <span className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                                                {deal.client && (
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {deal.client.nome}
                                                    </span>
                                                )}
                                                {deal.property && (
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />
                                                        {deal.property.titulo}
                                                    </span>
                                                )}
                                                {deal.data_prevista_fechamento && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(deal.data_prevista_fechamento).toLocaleDateString('pt-BR')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Value */}
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-emerald-400">
                                                R$ {deal.valor_proposta ? new Intl.NumberFormat('pt-BR').format(deal.valor_proposta) : '-'}
                                            </p>
                                            {deal.comissao_valor && (
                                                <p className="text-xs text-zinc-500">
                                                    Comissão: R$ {new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(deal.comissao_valor)}
                                                </p>
                                            )}
                                        </div>

                                        <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                    </Link>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
