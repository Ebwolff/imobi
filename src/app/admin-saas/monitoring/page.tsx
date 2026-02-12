import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Activity,
    Wifi,
    WifiOff,
    CheckCircle,
    AlertTriangle,
    XCircle,
    MessageCircle,
    Instagram,
    Globe,
    Clock,
    TrendingUp
} from "lucide-react"

// Mock data - would come from real monitoring
const integrations = [
    { name: "WhatsApp API", icon: MessageCircle, status: "online", latency: "45ms" },
    { name: "Instagram API", icon: Instagram, status: "online", latency: "120ms" },
    { name: "TikTok Lead Forms", icon: Globe, status: "offline", latency: "-" },
    { name: "Facebook Ads", icon: Globe, status: "online", latency: "89ms" },
]

const recentAlerts = [
    { type: "warning", message: "Alta latência na API do Instagram", time: "há 2 min" },
    { type: "error", message: "Falha na sincronização TikTok", time: "há 15 min" },
    { type: "success", message: "Webhook WhatsApp restaurado", time: "há 1 hora" },
]

const automationStats = {
    executed24h: 1247,
    failed24h: 3,
    successRate: 99.7
}

export default function MonitoringPage() {
    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">Monitoramento</h1>
                <p className="text-sm text-zinc-500">Status das integrações e saúde do sistema</p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">APIs Online</p>
                                <p className="text-3xl font-semibold text-white mt-1">
                                    {integrations.filter(i => i.status === 'online').length}/{integrations.length}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Wifi className="h-5 w-5 text-emerald-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Automações (24h)</p>
                                <p className="text-3xl font-semibold text-white mt-1">{automationStats.executed24h}</p>
                                <p className="text-xs text-zinc-500 mt-1">
                                    {automationStats.failed24h} falhas
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-sky-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardContent className="pt-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Taxa de Sucesso</p>
                                <p className="text-3xl font-semibold text-white mt-1">{automationStats.successRate}%</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-violet-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Integrations Status */}
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-zinc-400">Status das Integrações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {integrations.map((integration, i) => (
                            <div key={i} className="flex items-center justify-between py-2 px-3 -mx-3 rounded-lg hover:bg-zinc-800/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center">
                                        <integration.icon className="h-4 w-4 text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{integration.name}</p>
                                        <p className="text-xs text-zinc-500">Latência: {integration.latency}</p>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={
                                        integration.status === 'online'
                                            ? 'border-emerald-500/30 text-emerald-500'
                                            : 'border-rose-500/30 text-rose-500'
                                    }
                                >
                                    <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${integration.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'
                                        }`} />
                                    {integration.status}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Alerts */}
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-zinc-400">Alertas Recentes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentAlerts.map((alert, i) => {
                            const Icon = alert.type === 'error' ? XCircle :
                                alert.type === 'warning' ? AlertTriangle : CheckCircle
                            const color = alert.type === 'error' ? 'text-rose-500' :
                                alert.type === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                            return (
                                <div key={i} className="flex items-start gap-3 py-2">
                                    <Icon className={`h-4 w-4 mt-0.5 ${color}`} />
                                    <div className="flex-1">
                                        <p className="text-sm text-white">{alert.message}</p>
                                        <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {alert.time}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
