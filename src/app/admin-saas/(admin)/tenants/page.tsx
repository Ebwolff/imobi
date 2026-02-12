import { getAllTenants } from "@/app/admin-saas/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Building2,
    Plus,
    Search,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
    Clock,
    Filter
} from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    ativo: { label: "Ativo", color: "text-emerald-500", dot: "bg-emerald-500" },
    suspenso: { label: "Suspenso", color: "text-amber-500", dot: "bg-amber-500" },
    cancelado: { label: "Cancelado", color: "text-zinc-500", dot: "bg-zinc-500" },
}

const planoConfig: Record<string, { label: string; color: string }> = {
    free: { label: "Free", color: "bg-zinc-800 text-zinc-400" },
    starter: { label: "Starter", color: "bg-sky-500/10 text-sky-400" },
    pro: { label: "Pro", color: "bg-violet-500/10 text-violet-400" },
    enterprise: { label: "Enterprise", color: "bg-amber-500/10 text-amber-400" },
}

export default async function TenantsPage() {
    const tenants = await getAllTenants()

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Clientes</h1>
                    <p className="text-sm text-zinc-500">Gerencie os clientes da plataforma</p>
                </div>
                <Link href="/admin-saas/tenants/novo">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Cliente
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Buscar por nome ou email..."
                        className="pl-9 bg-zinc-900/50 border-zinc-800 h-9"
                    />
                </div>
                <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                </Button>
                <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Plano
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="flex items-center gap-6 text-sm">
                <span className="text-zinc-500">
                    <span className="text-white font-medium">{tenants.length}</span> clientes total
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                    <span className="text-emerald-500 font-medium">
                        {tenants.filter((t: any) => t.status === 'ativo').length}
                    </span> ativos
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                    <span className="text-amber-500 font-medium">
                        {tenants.filter((t: any) => t.status === 'suspenso').length}
                    </span> suspensos
                </span>
            </div>

            {/* Table */}
            <Card className="bg-zinc-900/30 border-zinc-800/50 overflow-hidden">
                <CardContent className="p-0">
                    {tenants.length > 0 ? (
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
                                        Criado em
                                    </th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/30">
                                {tenants.map((tenant: any) => {
                                    const status = statusConfig[tenant.status] || statusConfig.ativo
                                    const plano = planoConfig[tenant.plano] || planoConfig.free
                                    return (
                                        <tr
                                            key={tenant.id}
                                            className="hover:bg-zinc-800/20 transition-colors group"
                                        >
                                            <td className="p-4">
                                                <Link href={`/admin-saas/tenants/${tenant.id}`} className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center">
                                                        <Building2 className="h-4 w-4 text-zinc-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                                                            {tenant.nome_empresa}
                                                        </p>
                                                        <p className="text-xs text-zinc-500">{tenant.email_principal}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={`${plano.color} text-xs font-medium`}>
                                                    {plano.label}
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
                                                <span className="text-sm text-zinc-500">
                                                    {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <Link href={`/admin-saas/tenants/${tenant.id}`}>
                                                    <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-16 text-center">
                            <Building2 className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-sm font-medium text-white mb-1">Nenhum cliente cadastrado</h3>
                            <p className="text-xs text-zinc-500 mb-4">Comece cadastrando seu primeiro cliente</p>
                            <Link href="/admin-saas/tenants/novo">
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Cadastrar Cliente
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
