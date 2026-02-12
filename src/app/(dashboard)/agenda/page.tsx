import { getVisits } from "./actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, MapPin, User, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string, color: string, dot: string }> = {
    agendada: { label: "Agendada", color: "text-sky-400", dot: "bg-sky-500" },
    confirmada: { label: "Confirmada", color: "text-emerald-400", dot: "bg-emerald-500" },
    realizada: { label: "Realizada", color: "text-violet-400", dot: "bg-violet-500" },
    cancelada: { label: "Cancelada", color: "text-rose-400", dot: "bg-rose-500" },
    remarcada: { label: "Remarcada", color: "text-amber-400", dot: "bg-amber-500" },
}

function groupVisitsByDate(visits: any[]) {
    const groups: Record<string, any[]> = {}
    visits.forEach(visit => {
        const date = new Date(visit.data_visita).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
        if (!groups[date]) groups[date] = []
        groups[date].push(visit)
    })
    return groups
}

export default async function AgendaPage() {
    const visits = await getVisits()
    const groupedVisits = groupVisitsByDate(visits)

    const today = new Date()
    const todayVisits = visits.filter((v: any) =>
        new Date(v.data_visita).toDateString() === today.toDateString()
    ).length

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Agenda</h1>
                    <p className="text-sm text-zinc-500">Visitas agendadas e realizadas</p>
                </div>
                <Link href="/agenda/nova">
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Agendar Visita
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
                <span className="text-zinc-500">
                    <span className="text-white font-medium">{visits.length}</span> visitas total
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                    <span className="text-sky-400 font-medium">{todayVisits}</span> hoje
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                    <span className="text-emerald-400 font-medium">
                        {visits.filter((v: any) => v.status === 'confirmada').length}
                    </span> confirmadas
                </span>
            </div>

            {/* List */}
            {visits.length === 0 ? (
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardContent className="py-16 text-center">
                        <Calendar className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-sm font-medium text-white mb-1">Nenhuma visita agendada</h3>
                        <p className="text-xs text-zinc-500 mb-4">Agende sua primeira visita</p>
                        <Link href="/agenda/nova">
                            <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Agendar Visita
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedVisits).map(([date, dateVisits]) => (
                        <div key={date}>
                            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 first-letter:uppercase">
                                {date}
                            </h3>
                            <div className="space-y-2">
                                {dateVisits.map((visit: any) => {
                                    const statusInfo = statusConfig[visit.status] || statusConfig.agendada
                                    const time = new Date(visit.data_visita).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                    return (
                                        <Card key={visit.id} className="bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700 transition-all">
                                            <CardContent className="flex items-center gap-4 p-4">
                                                {/* Time */}
                                                <div className="flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-sky-500/10">
                                                    <span className="text-lg font-bold text-sky-400 font-mono">{time}</span>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        {visit.property && (
                                                            <h4 className="font-medium text-white truncate">{visit.property.titulo}</h4>
                                                        )}
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`h-2 w-2 rounded-full ${statusInfo.dot}`} />
                                                            <span className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                                                        {visit.client && (
                                                            <span className="flex items-center gap-1">
                                                                <User className="h-3 w-3" />
                                                                {visit.client.nome}
                                                            </span>
                                                        )}
                                                        {visit.property?.cidade && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {visit.property.cidade}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {visit.duracao_minutos}min
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10">
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
