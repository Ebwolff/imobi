import { getProperties } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Home, Building2, MapPin, Bed, Bath, Car, DollarSign, Filter, LayoutGrid, List } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    disponivel: { label: "Disponível", color: "text-emerald-400", dot: "bg-emerald-500" },
    reservado: { label: "Reservado", color: "text-amber-400", dot: "bg-amber-500" },
    vendido: { label: "Vendido", color: "text-sky-400", dot: "bg-sky-500" },
    alugado: { label: "Alugado", color: "text-violet-400", dot: "bg-violet-500" },
    inativo: { label: "Inativo", color: "text-zinc-400", dot: "bg-zinc-500" },
}

const tipoIcons: Record<string, React.ElementType> = {
    casa: Home,
    apartamento: Building2,
    terreno: MapPin,
    comercial: Building2,
    rural: MapPin,
}

export default async function ImoveisPage() {
    const properties = await getProperties()

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Imóveis</h1>
                    <p className="text-sm text-zinc-500">Gerencie sua carteira de imóveis</p>
                </div>
                <Link href="/imoveis/novo">
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Imóvel
                    </Button>
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Buscar imóvel..."
                            className="pl-9 h-9 bg-zinc-900/50 border-zinc-800"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-9 border-zinc-800 text-zinc-400">
                        <Filter className="h-4 w-4 mr-2" />
                        Tipo
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 border-zinc-800 text-zinc-400">
                        <Filter className="h-4 w-4 mr-2" />
                        Status
                    </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-zinc-500">
                        <span className="text-white font-medium">{properties.length}</span> imóveis
                    </span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-zinc-500">
                        <span className="text-emerald-400 font-medium">
                            {properties.filter((p: any) => p.status === 'disponivel').length}
                        </span> disponíveis
                    </span>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-zinc-900/50 rounded-lg p-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2 bg-zinc-800 text-white">
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-zinc-500">
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            {properties.length === 0 ? (
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardContent className="py-16 text-center">
                        <Building2 className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-sm font-medium text-white mb-1">Nenhum imóvel cadastrado</h3>
                        <p className="text-xs text-zinc-500 mb-4">Comece adicionando seu primeiro imóvel</p>
                        <Link href="/imoveis/novo">
                            <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Cadastrar Imóvel
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {properties.map((property: any) => {
                        const TipoIcon = tipoIcons[property.tipo] || Building2
                        const status = statusConfig[property.status] || statusConfig.disponivel
                        return (
                            <Link key={property.id} href={`/imoveis/${property.id}`}>
                                <Card className="group overflow-hidden bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer">
                                    {/* Image Placeholder */}
                                    <div className="relative h-36 bg-zinc-800/50 flex items-center justify-center">
                                        <TipoIcon className="h-10 w-10 text-zinc-700" />
                                        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-sm px-2 py-1 rounded-md">
                                            <div className={`h-2 w-2 rounded-full ${status.dot}`} />
                                            <span className={`text-xs ${status.color}`}>{status.label}</span>
                                        </div>
                                    </div>

                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-sm font-medium text-white truncate group-hover:text-sky-400 transition-colors">
                                            {property.titulo}
                                        </CardTitle>
                                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {property.bairro ? `${property.bairro}, ` : ''}{property.cidade}
                                        </p>
                                    </CardHeader>

                                    <CardContent className="p-4 pt-0">
                                        {/* Features */}
                                        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                                            {property.quartos > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Bed className="h-3 w-3" /> {property.quartos}
                                                </span>
                                            )}
                                            {property.banheiros > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Bath className="h-3 w-3" /> {property.banheiros}
                                                </span>
                                            )}
                                            {property.vagas > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Car className="h-3 w-3" /> {property.vagas}
                                                </span>
                                            )}
                                            {property.area_total && (
                                                <span>{property.area_total}m²</span>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <p className="text-lg font-semibold text-emerald-400">
                                            R$ {new Intl.NumberFormat('pt-BR').format(property.valor)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
