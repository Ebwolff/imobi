'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createPlan } from "@/app/admin-saas/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function NovoPlanoPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createPlan(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Plano criado com sucesso!")
            router.push('/admin-saas/plans')
        }
        setLoading(false)
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin-saas/plans">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-white">Novo Plano</h1>
                    <p className="text-xs text-zinc-500 font-mono">Criar novo plano de assinatura</p>
                </div>
            </div>

            {/* Form */}
            <form action={handleSubmit}>
                <div className="max-w-2xl space-y-6">
                    <Card className="bg-zinc-900/50 border-amber-500/20">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2 text-white">
                                <CreditCard className="h-4 w-4 text-amber-500" />
                                Dados do Plano
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nome" className="text-zinc-300">Nome do Plano</Label>
                                    <Input
                                        id="nome"
                                        name="nome"
                                        placeholder="Ex: Pro"
                                        required
                                        className="bg-zinc-800/50 border-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="valor_mensal" className="text-zinc-300">Valor Mensal (R$)</Label>
                                    <Input
                                        id="valor_mensal"
                                        name="valor_mensal"
                                        type="number"
                                        step="0.01"
                                        placeholder="99.00"
                                        required
                                        className="bg-zinc-800/50 border-zinc-700"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-base text-white">Limites</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="limite_usuarios" className="text-zinc-300">Limite de Usuários</Label>
                                <Input
                                    id="limite_usuarios"
                                    name="limite_usuarios"
                                    type="number"
                                    defaultValue="5"
                                    className="bg-zinc-800/50 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="limite_leads" className="text-zinc-300">Limite de Leads</Label>
                                <Input
                                    id="limite_leads"
                                    name="limite_leads"
                                    type="number"
                                    defaultValue="500"
                                    className="bg-zinc-800/50 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="limite_automacoes" className="text-zinc-300">Limite de Automações</Label>
                                <Input
                                    id="limite_automacoes"
                                    name="limite_automacoes"
                                    type="number"
                                    defaultValue="10"
                                    className="bg-zinc-800/50 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="limite_integracoes" className="text-zinc-300">Limite de Integrações</Label>
                                <Input
                                    id="limite_integracoes"
                                    name="limite_integracoes"
                                    type="number"
                                    defaultValue="3"
                                    className="bg-zinc-800/50 border-zinc-700"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Link href="/admin-saas/plans">
                            <Button variant="outline" type="button" className="border-zinc-700 text-zinc-400">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Criar Plano
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
