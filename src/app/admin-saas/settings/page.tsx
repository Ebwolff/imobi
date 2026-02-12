'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Settings,
    Save,
    Building2,
    Mail,
    CreditCard,
    Bell,
    Shield,
    Loader2
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)

    function handleSave() {
        setLoading(true)
        setTimeout(() => {
            toast.success("Configurações salvas com sucesso!")
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="p-6 space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">Configurações</h1>
                <p className="text-sm text-zinc-500">Configure as preferências da plataforma</p>
            </div>

            <div className="space-y-6">
                {/* General */}
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Informações Gerais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm text-zinc-300">Nome da Plataforma</Label>
                                <Input
                                    defaultValue="CRM Imobiliário"
                                    className="bg-zinc-800/50 border-zinc-700 h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-zinc-300">Domínio</Label>
                                <Input
                                    defaultValue="app.crmimobiliario.com"
                                    className="bg-zinc-800/50 border-zinc-700 h-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-zinc-300">Email de Suporte</Label>
                            <Input
                                type="email"
                                defaultValue="suporte@crmimobiliario.com"
                                className="bg-zinc-800/50 border-zinc-700 h-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Billing */}
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Pagamentos (Stripe)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm text-zinc-300">Stripe Secret Key</Label>
                            <Input
                                type="password"
                                placeholder="sk_live_..."
                                className="bg-zinc-800/50 border-zinc-700 h-10 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-zinc-300">Stripe Webhook Secret</Label>
                            <Input
                                type="password"
                                placeholder="whsec_..."
                                className="bg-zinc-800/50 border-zinc-700 h-10 font-mono"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Notificações
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm text-zinc-300">Email para Alertas</Label>
                            <Input
                                type="email"
                                placeholder="alertas@empresa.com"
                                className="bg-zinc-800/50 border-zinc-700 h-10"
                            />
                            <p className="text-xs text-zinc-500">
                                Receba alertas sobre novos clientes, pagamentos e erros críticos
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Segurança
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm text-zinc-300">Sessão (minutos)</Label>
                                <Input
                                    type="number"
                                    defaultValue="1440"
                                    className="bg-zinc-800/50 border-zinc-700 h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-zinc-300">Rate Limit (req/min)</Label>
                                <Input
                                    type="number"
                                    defaultValue="100"
                                    className="bg-zinc-800/50 border-zinc-700 h-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-40"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Configurações
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
