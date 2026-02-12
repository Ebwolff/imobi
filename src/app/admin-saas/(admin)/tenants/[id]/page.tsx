import { getTenantDetails } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Building2,
    ArrowLeft,
    Users,
    Inbox,
    UserCheck,
    Home,
    Handshake,
    Calendar,
    Mail,
    Phone,
    CreditCard,
    Activity,
    CheckCircle,
    AlertTriangle,
    Clock
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    ativo: { label: "Ativo", color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle },
    suspenso: { label: "Suspenso", color: "bg-rose-500/10 text-rose-500", icon: AlertTriangle },
    cancelado: { label: "Cancelado", color: "bg-zinc-500/10 text-zinc-500", icon: AlertTriangle },
}

export default async function TenantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const tenant = await getTenantDetails(id)

    if (!tenant) {
        notFound()
    }

    const status = statusConfig[tenant.status] || statusConfig.ativo
    const StatusIcon = status.icon

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin-saas/tenants">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{tenant.nome_empresa}</h1>
                            <p className="text-xs text-zinc-500 font-mono">/{tenant.slug}</p>
                        </div>
                    </div>
                </div>
                <Badge variant="outline" className={status.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 gap-4">
                <Card className="bg-zinc-900/50 border-sky-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-sky-500" />
                            <div>
                                <p className="text-2xl font-bold text-white font-mono">{tenant.stats.users}</p>
                                <p className="text-xs text-zinc-500">Usuários</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-amber-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Inbox className="h-5 w-5 text-amber-500" />
                            <div>
                                <p className="text-2xl font-bold text-white font-mono">{tenant.stats.leads}</p>
                                <p className="text-xs text-zinc-500">Leads</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-emerald-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <UserCheck className="h-5 w-5 text-emerald-500" />
                            <div>
                                <p className="text-2xl font-bold text-white font-mono">{tenant.stats.clients}</p>
                                <p className="text-xs text-zinc-500">Clientes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-violet-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Home className="h-5 w-5 text-violet-500" />
                            <div>
                                <p className="text-2xl font-bold text-white font-mono">{tenant.stats.properties}</p>
                                <p className="text-xs text-zinc-500">Imóveis</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-rose-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Handshake className="h-5 w-5 text-rose-500" />
                            <div>
                                <p className="text-2xl font-bold text-white font-mono">{tenant.stats.deals}</p>
                                <p className="text-xs text-zinc-500">Negócios</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Contact Info */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm text-zinc-400">Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-zinc-500" />
                            <span className="text-white">{tenant.email_principal}</span>
                        </div>
                        {tenant.cnpj && (
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-zinc-500" />
                                <span className="text-zinc-400">{tenant.cnpj}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-zinc-500" />
                            <span className="text-zinc-400">
                                Desde {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm text-zinc-400">Assinatura</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="h-5 w-5 text-amber-500" />
                            <div>
                                <p className="font-medium text-white">
                                    {tenant.subscription?.plans?.nome || tenant.plano?.toUpperCase() || 'Free'}
                                </p>
                                {tenant.subscription?.plans?.valor_mensal > 0 && (
                                    <p className="text-sm text-zinc-500">
                                        R$ {tenant.subscription.plans.valor_mensal}/mês
                                    </p>
                                )}
                            </div>
                        </div>
                        {tenant.subscription && (
                            <Badge className={
                                tenant.subscription.status === 'ativa'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-amber-500/10 text-amber-500'
                            }>
                                {tenant.subscription.status}
                            </Badge>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Últimos Leads
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tenant.recentLeads.length > 0 ? (
                            <div className="space-y-2">
                                {tenant.recentLeads.map((lead: any) => (
                                    <div key={lead.id} className="flex items-center justify-between py-1 text-sm">
                                        <span className="text-white truncate">{lead.name}</span>
                                        <span className="text-xs text-zinc-500">
                                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500">Nenhum lead ainda.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="py-4">
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-zinc-700 text-zinc-400">
                            Alterar Plano
                        </Button>
                        <Button variant="outline" className="border-zinc-700 text-zinc-400">
                            Resetar Senha Admin
                        </Button>
                        {tenant.status === 'ativo' ? (
                            <Button variant="outline" className="border-rose-500/50 text-rose-500 hover:bg-rose-500/10">
                                Suspender Tenant
                            </Button>
                        ) : (
                            <Button variant="outline" className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10">
                                Reativar Tenant
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
