'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Home, Key, DollarSign, Percent, User, Building2, Calendar } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createDeal } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Client = { id: string, nome: string }
type Property = { id: string, titulo: string, valor: number }

export function NewDealForm({ clients, properties }: { clients: Client[], properties: Property[] }) {
    const [loading, setLoading] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState<string>('')
    const [valorProposta, setValorProposta] = useState<string>('')
    const [comissao, setComissao] = useState<string>('6')
    const router = useRouter()

    function handlePropertyChange(propertyId: string) {
        setSelectedProperty(propertyId)
        const property = properties.find(p => p.id === propertyId)
        if (property) {
            setValorProposta(property.valor.toString())
        }
    }

    const comissaoEstimada = valorProposta && comissao
        ? (Number(valorProposta) * Number(comissao)) / 100
        : 0

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createDeal(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Negociação criada!")
            router.push('/negocios')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-full bg-zinc-950">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/50">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/negocios">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-white">Nova Negociação</h1>
                            <p className="text-xs text-zinc-500">Registre uma venda ou locação</p>
                        </div>
                    </div>
                    <Button type="submit" form="deal-form" disabled={loading} className="bg-sky-600 hover:bg-sky-700">
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
                <form id="deal-form" action={handleSubmit} className="space-y-8">

                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Informações da Negociação</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="titulo">Título *</Label>
                                <Input
                                    id="titulo"
                                    name="titulo"
                                    placeholder="Ex: Venda Apt 302 - João Silva"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tipo" className="flex items-center gap-2">
                                        <Home className="h-3 w-3" />
                                        Tipo
                                    </Label>
                                    <Select name="tipo" defaultValue="venda">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="venda">
                                                <span className="flex items-center gap-2">
                                                    <Home className="h-4 w-4 text-zinc-500" /> Venda
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="aluguel">
                                                <span className="flex items-center gap-2">
                                                    <Key className="h-4 w-4 text-zinc-500" /> Aluguel
                                                </span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="data_prevista_fechamento" className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        Previsão Fechamento
                                    </Label>
                                    <Input
                                        id="data_prevista_fechamento"
                                        name="data_prevista_fechamento"
                                        type="date"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Relations */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Cliente e Imóvel</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="client_id" className="flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    Cliente
                                </Label>
                                <Select name="client_id">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.length === 0 ? (
                                            <div className="py-4 text-center text-sm text-zinc-500">
                                                Nenhum cliente cadastrado
                                            </div>
                                        ) : (
                                            clients.map(client => (
                                                <SelectItem key={client.id} value={client.id}>
                                                    {client.nome}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="property_id" className="flex items-center gap-2">
                                    <Building2 className="h-3 w-3" />
                                    Imóvel
                                </Label>
                                <Select name="property_id" value={selectedProperty} onValueChange={handlePropertyChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um imóvel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {properties.length === 0 ? (
                                            <div className="py-4 text-center text-sm text-zinc-500">
                                                Nenhum imóvel cadastrado
                                            </div>
                                        ) : (
                                            properties.map(property => (
                                                <SelectItem key={property.id} value={property.id}>
                                                    {property.titulo} - R$ {(property.valor / 1000).toFixed(0)}k
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Values */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Valores</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="valor_proposta" className="flex items-center gap-2">
                                    <DollarSign className="h-3 w-3" />
                                    Valor Proposta (R$)
                                </Label>
                                <Input
                                    id="valor_proposta"
                                    name="valor_proposta"
                                    type="number"
                                    value={valorProposta}
                                    onChange={(e) => setValorProposta(e.target.value)}
                                    placeholder="500000"
                                    className="text-lg font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comissao_percentual" className="flex items-center gap-2">
                                    <Percent className="h-3 w-3" />
                                    Comissão (%)
                                </Label>
                                <Input
                                    id="comissao_percentual"
                                    name="comissao_percentual"
                                    type="number"
                                    step="0.5"
                                    value={comissao}
                                    onChange={(e) => setComissao(e.target.value)}
                                />
                            </div>
                        </div>

                        {comissaoEstimada > 0 && (
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-sm text-emerald-400">
                                    Comissão estimada: <span className="font-semibold">R$ {comissaoEstimada.toLocaleString('pt-BR')}</span>
                                </p>
                            </div>
                        )}
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Notes */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Observações</h2>

                        <Textarea
                            name="observacoes"
                            rows={4}
                            placeholder="Detalhes da negociação, condições especiais..."
                        />
                    </section>

                    {/* Mobile Submit */}
                    <div className="flex gap-3 pt-4 lg:hidden">
                        <Link href="/negocios" className="flex-1">
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
