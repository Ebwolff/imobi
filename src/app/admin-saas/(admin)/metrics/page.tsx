import { Card, CardContent } from "@/components/ui/card"
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    Activity
} from "lucide-react"

export default function MetricsPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Métricas</h1>
                <p className="text-sm text-zinc-400 font-mono">Análise de performance do SaaS</p>
            </div>

            {/* Charts placeholder */}
            <div className="grid grid-cols-2 gap-6">
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="h-5 w-5 text-emerald-500" />
                            <h3 className="font-medium text-white">Receita Mensal (MRR)</h3>
                        </div>
                        <div className="h-48 flex items-center justify-center border border-dashed border-zinc-700 rounded-lg">
                            <p className="text-zinc-500 text-sm">Gráfico de MRR</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="h-5 w-5 text-sky-500" />
                            <h3 className="font-medium text-white">Crescimento de Tenants</h3>
                        </div>
                        <div className="h-48 flex items-center justify-center border border-dashed border-zinc-700 rounded-lg">
                            <p className="text-zinc-500 text-sm">Gráfico de crescimento</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="h-5 w-5 text-violet-500" />
                            <h3 className="font-medium text-white">Leads Processados</h3>
                        </div>
                        <div className="h-48 flex items-center justify-center border border-dashed border-zinc-700 rounded-lg">
                            <p className="text-zinc-500 text-sm">Gráfico de leads</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                            <h3 className="font-medium text-white">Churn Rate</h3>
                        </div>
                        <div className="h-48 flex items-center justify-center border border-dashed border-zinc-700 rounded-lg">
                            <p className="text-zinc-500 text-sm">Gráfico de churn</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
