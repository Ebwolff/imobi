import { getPlans } from "../actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    CreditCard,
    Users,
    Inbox,
    Zap,
    Link2,
    Check
} from "lucide-react"
import Link from "next/link"

export default async function PlansPage() {
    const plans = await getPlans()

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Planos</h1>
                    <p className="text-sm text-zinc-500">Configure os planos disponíveis para seus clientes</p>
                </div>
                <Link href="/admin-saas/plans/novo">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Plano
                    </Button>
                </Link>
            </div>

            {/* Plans Grid */}
            {plans.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                    {plans.map((plan: any, index: number) => (
                        <Card
                            key={plan.id}
                            className={`bg-zinc-900/30 border-zinc-800/50 relative overflow-hidden ${index === 2 ? 'ring-1 ring-emerald-500/50' : ''
                                }`}
                        >
                            {index === 2 && (
                                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                                    Popular
                                </div>
                            )}
                            <CardContent className="pt-6">
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-semibold text-white">{plan.nome}</h3>
                                        {!plan.ativo && (
                                            <Badge variant="outline" className="border-zinc-700 text-zinc-500 text-xs">
                                                Inativo
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500">/{plan.slug}</p>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">
                                            R$ {plan.valor_mensal}
                                        </span>
                                        <span className="text-sm text-zinc-500">/mês</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        <span className="text-zinc-300">{plan.limite_usuarios} usuários</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        <span className="text-zinc-300">{plan.limite_leads} leads/mês</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        <span className="text-zinc-300">{plan.limite_automacoes} automações</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        <span className="text-zinc-300">{plan.limite_integracoes} integrações</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
                                >
                                    Editar Plano
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardContent className="py-16 text-center">
                        <CreditCard className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-sm font-medium text-white mb-1">Nenhum plano cadastrado</h3>
                        <p className="text-xs text-zinc-500 mb-4">Crie seu primeiro plano para começar</p>
                        <Link href="/admin-saas/plans/novo">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Criar Plano
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
