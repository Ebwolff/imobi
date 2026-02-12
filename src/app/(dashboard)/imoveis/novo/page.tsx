'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Home, Building2, MapPin, Tractor, Store, DollarSign, Maximize, BedDouble, Bath, Car } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createProperty } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const tipoOptions = [
    { value: 'casa', label: 'Casa', icon: Home },
    { value: 'apartamento', label: 'Apartamento', icon: Building2 },
    { value: 'terreno', label: 'Terreno', icon: MapPin },
    { value: 'comercial', label: 'Comercial', icon: Store },
    { value: 'rural', label: 'Rural', icon: Tractor },
]

export default function NovoImovelPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createProperty(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Imóvel cadastrado!")
            router.push('/imoveis')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-full bg-zinc-950">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/50">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/imoveis">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-white">Novo Imóvel</h1>
                            <p className="text-xs text-zinc-500">Cadastre um imóvel na carteira</p>
                        </div>
                    </div>
                    <Button type="submit" form="property-form" disabled={loading} className="bg-sky-600 hover:bg-sky-700">
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
            <div className="max-w-3xl mx-auto px-6 py-8">
                <form id="property-form" action={handleSubmit} className="space-y-8">

                    {/* Basic Info Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Informações Básicas</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="titulo">Título do Anúncio *</Label>
                                <Input
                                    id="titulo"
                                    name="titulo"
                                    placeholder="Ex: Casa 3 quartos no Jardim Europa"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tipo">Tipo *</Label>
                                    <Select name="tipo" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
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
                                <div className="space-y-2">
                                    <Label htmlFor="finalidade">Finalidade</Label>
                                    <Select name="finalidade" defaultValue="venda">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="venda">Venda</SelectItem>
                                            <SelectItem value="aluguel">Aluguel</SelectItem>
                                            <SelectItem value="ambos">Venda e Aluguel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Location Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Localização</h2>

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
                                    <Label htmlFor="cidade">Cidade *</Label>
                                    <Input id="cidade" name="cidade" placeholder="São Paulo" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Input id="estado" name="estado" defaultValue="SP" placeholder="SP" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Features Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Características</h2>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="area_total" className="flex items-center gap-2">
                                    <Maximize className="h-3 w-3" />
                                    Área (m²)
                                </Label>
                                <Input id="area_total" name="area_total" type="number" placeholder="150" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quartos" className="flex items-center gap-2">
                                    <BedDouble className="h-3 w-3" />
                                    Quartos
                                </Label>
                                <Input id="quartos" name="quartos" type="number" defaultValue="0" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="banheiros" className="flex items-center gap-2">
                                    <Bath className="h-3 w-3" />
                                    Banheiros
                                </Label>
                                <Input id="banheiros" name="banheiros" type="number" defaultValue="0" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vagas" className="flex items-center gap-2">
                                    <Car className="h-3 w-3" />
                                    Vagas
                                </Label>
                                <Input id="vagas" name="vagas" type="number" defaultValue="0" />
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Price Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Valor</h2>

                        <div className="space-y-2">
                            <Label htmlFor="valor" className="flex items-center gap-2">
                                <DollarSign className="h-3 w-3" />
                                Preço (R$) *
                            </Label>
                            <Input
                                id="valor"
                                name="valor"
                                type="number"
                                placeholder="500000"
                                required
                                className="text-lg font-semibold"
                            />
                        </div>
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Description Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Descrição</h2>

                        <Textarea
                            name="descricao"
                            rows={5}
                            placeholder="Descreva o imóvel em detalhes: características, diferenciais, proximidade de comércios, escolas..."
                        />
                    </section>

                    {/* Mobile Submit */}
                    <div className="flex gap-3 pt-4 lg:hidden">
                        <Link href="/imoveis" className="flex-1">
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
