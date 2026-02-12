import { getClients } from "./actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, UserCheck, Filter, Phone, Mail, MapPin, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const tipoConfig: Record<string, { label: string; color: string; dot: string }> = {
    comprador: { label: "Comprador", color: "text-sky-400", dot: "bg-sky-500" },
    vendedor: { label: "Vendedor", color: "text-emerald-400", dot: "bg-emerald-500" },
    locatario: { label: "Locatário", color: "text-amber-400", dot: "bg-amber-500" },
    locador: { label: "Locador", color: "text-violet-400", dot: "bg-violet-500" },
}

export default async function ClientesPage() {
    const clients = await getClients()

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Clientes</h1>
                    <p className="text-sm text-zinc-500">Leads qualificados e clientes ativos</p>
                </div>
                <Link href="/clientes/novo">
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Cliente
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Buscar por nome, telefone..."
                        className="pl-9 bg-zinc-900/50 border-zinc-800 h-9"
                    />
                </div>
                <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Tipo
                </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
                <span className="text-zinc-500">
                    <span className="text-white font-medium">{clients.length}</span> clientes
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                    <span className="text-sky-400 font-medium">
                        {clients.filter((c: any) => c.tipo === 'comprador').length}
                    </span> compradores
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                    <span className="text-emerald-400 font-medium">
                        {clients.filter((c: any) => c.tipo === 'vendedor').length}
                    </span> vendedores
                </span>
            </div>

            {/* Client List */}
            {clients.length === 0 ? (
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardContent className="py-16 text-center">
                        <UserCheck className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-sm font-medium text-white mb-1">Nenhum cliente cadastrado</h3>
                        <p className="text-xs text-zinc-500 mb-4">Converta leads ou cadastre manualmente</p>
                        <Link href="/clientes/novo">
                            <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Cadastrar Cliente
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-zinc-900/30 border-zinc-800/50 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-800/30">
                            {clients.map((client: any) => {
                                const tipo = tipoConfig[client.tipo] || tipoConfig.comprador
                                return (
                                    <Link
                                        key={client.id}
                                        href={`/clientes/${client.id}`}
                                        className="flex items-center gap-4 p-4 hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        {/* Avatar */}
                                        <Avatar className="h-10 w-10 bg-zinc-800 border border-zinc-700">
                                            <AvatarFallback className="text-sm font-semibold text-zinc-400 bg-transparent">
                                                {client.nome.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-white group-hover:text-sky-400 transition-colors">
                                                    {client.nome}
                                                </h3>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-2 w-2 rounded-full ${tipo.dot}`} />
                                                    <span className={`text-xs ${tipo.color}`}>
                                                        {tipo.label}
                                                    </span>
                                                </div>
                                                {!client.ativo && (
                                                    <Badge variant="outline" className="border-zinc-700 text-zinc-500 text-[10px]">
                                                        Inativo
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                                                {client.telefone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {client.telefone}
                                                    </span>
                                                )}
                                                {client.email && (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {client.email}
                                                    </span>
                                                )}
                                                {client.cidade && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {client.cidade}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                    </Link>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
