import { getAuditLogs } from "@/app/admin-saas/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    FileText,
    Building2,
    Clock,
    Search,
    Filter,
    User,
    Settings,
    CreditCard,
    Shield
} from "lucide-react"

const actionConfig: Record<string, { color: string; icon: React.ElementType }> = {
    create: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: FileText },
    update: { color: "bg-sky-500/10 text-sky-500 border-sky-500/20", icon: Settings },
    delete: { color: "bg-rose-500/10 text-rose-500 border-rose-500/20", icon: FileText },
    login: { color: "bg-violet-500/10 text-violet-500 border-violet-500/20", icon: User },
    suspend: { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Shield },
    plan_change: { color: "bg-sky-500/10 text-sky-500 border-sky-500/20", icon: CreditCard },
}

export default async function LogsPage() {
    const logs = await getAuditLogs(50)

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">Logs & Auditoria</h1>
                <p className="text-sm text-zinc-500">Histórico de ações na plataforma</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Buscar por ação ou tenant..."
                        className="pl-9 bg-zinc-900/50 border-zinc-800 h-9"
                    />
                </div>
                <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Tipo
                </Button>
                <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Período
                </Button>
            </div>

            {/* Logs List */}
            <Card className="bg-zinc-900/30 border-zinc-800/50">
                <CardContent className="p-0">
                    {logs.length > 0 ? (
                        <div className="divide-y divide-zinc-800/30">
                            {logs.map((log: any) => {
                                const actionType = log.acao?.split('_')[0] || 'update'
                                const config = actionConfig[actionType] || actionConfig.update
                                const ActionIcon = config.icon

                                return (
                                    <div key={log.id} className="p-4 hover:bg-zinc-800/20 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                                <ActionIcon className="h-4 w-4 text-zinc-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge variant="outline" className={config.color}>
                                                        {log.acao}
                                                    </Badge>
                                                    {log.entidade && (
                                                        <span className="text-xs text-zinc-500">
                                                            em {log.entidade}
                                                        </span>
                                                    )}
                                                </div>
                                                {log.tenants?.nome_empresa && (
                                                    <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />
                                                        {log.tenants.nome_empresa}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(log.created_at).toLocaleString('pt-BR')}
                                                </p>
                                                {log.ip && (
                                                    <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                                                        {log.ip}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <FileText className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-sm font-medium text-white mb-1">Nenhum log registrado</h3>
                            <p className="text-xs text-zinc-500">As ações da plataforma aparecerão aqui</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
