'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Building2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createTenant } from "@/app/admin-saas/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function NovoTenantPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createTenant(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Cliente criado com sucesso!")
            router.push('/admin-saas/tenants')
        }
        setLoading(false)
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin-saas/tenants">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-semibold text-white">Novo Cliente</h1>
                    <p className="text-sm text-zinc-500">Cadastre um novo cliente na plataforma</p>
                </div>
            </div>

            {/* Form */}
            <form action={handleSubmit} className="space-y-6">
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Dados da Empresa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome_empresa" className="text-sm text-zinc-300">
                                Nome da Empresa <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="nome_empresa"
                                name="nome_empresa"
                                placeholder="Ex: Imobiliária Premium"
                                required
                                className="bg-zinc-800/50 border-zinc-700 h-10"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email_principal" className="text-sm text-zinc-300">
                                    Email Principal <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="email_principal"
                                    name="email_principal"
                                    type="email"
                                    placeholder="contato@empresa.com"
                                    required
                                    className="bg-zinc-800/50 border-zinc-700 h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cnpj" className="text-sm text-zinc-300">CNPJ</Label>
                                <Input
                                    id="cnpj"
                                    name="cnpj"
                                    placeholder="00.000.000/0001-00"
                                    className="bg-zinc-800/50 border-zinc-700 h-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plano" className="text-sm text-zinc-300">Plano Inicial</Label>
                            <Select name="plano" defaultValue="free">
                                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="starter">Starter - R$ 97/mês</SelectItem>
                                    <SelectItem value="pro">Pro - R$ 197/mês</SelectItem>
                                    <SelectItem value="enterprise">Enterprise - R$ 497/mês</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Link href="/admin-saas/tenants">
                        <Button variant="ghost" type="button" className="text-zinc-400">
                            Cancelar
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-32"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Criar Cliente
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
