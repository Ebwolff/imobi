'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, User, ShoppingCart, Home, Key, Building, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClientRecord } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const tipoOptions = [
    { value: 'comprador', label: 'Comprador', icon: ShoppingCart },
    { value: 'vendedor', label: 'Vendedor', icon: Home },
    { value: 'locatario', label: 'Locatário', icon: Key },
    { value: 'locador', label: 'Locador', icon: Building },
]

export default function NovoClientePage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createClientRecord(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Cliente cadastrado!")
            router.push('/clientes')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-full bg-zinc-950">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/50">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/clientes">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-white">Novo Cliente</h1>
                            <p className="text-xs text-zinc-500">Cadastre um novo cliente</p>
                        </div>
                    </div>
                    <Button type="submit" form="client-form" disabled={loading} className="bg-sky-600 hover:bg-sky-700">
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-2xl mx-auto px-6 py-8">
                <form id="client-form" action={handleSubmit} className="space-y-8">

                    {/* Personal Info */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Informações Pessoais</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome" className="flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    Nome Completo *
                                </Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    placeholder="João da Silva"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-3 w-3" />
                                        E-mail
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="email@exemplo.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefone" className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" />
                                        Telefone
                                    </Label>
                                    <Input
                                        id="telefone"
                                        name="telefone"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input
                                        id="cpf"
                                        name="cpf"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tipo">Tipo de Cliente</Label>
                                    <Select name="tipo" defaultValue="comprador">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tipoOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <span className="flex items-center gap-2">
                                                        <opt.icon className="h-4 w-4 text-zinc-500" />
                                                        {opt.label}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Address */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            Endereço
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input
                                    id="endereco"
                                    name="endereco"
                                    placeholder="Rua, número"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bairro">Bairro</Label>
                                    <Input id="bairro" name="bairro" placeholder="Centro" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cidade">Cidade</Label>
                                    <Input id="cidade" name="cidade" placeholder="São Paulo" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Input id="estado" name="estado" defaultValue="SP" placeholder="SP" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Notes */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Observações</h2>

                        <Textarea
                            name="observacoes"
                            rows={4}
                            placeholder="Notas sobre este cliente, preferências, orçamento..."
                        />
                    </section>

                    {/* Mobile Submit */}
                    <div className="flex gap-3 pt-4 lg:hidden">
                        <Link href="/clientes" className="flex-1">
                            <Button variant="outline" type="button" className="w-full">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="flex-1 bg-sky-600 hover:bg-sky-700">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Salvar
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
