import { getLeads, getPipelineStages } from "./actions"
import { LeadBoard } from "@/components/leads/lead-board"
import { NewLeadDialog } from "@/components/leads/new-lead-dialog"
import { Card } from "@/components/ui/card"
import { Filter, Search, LayoutGrid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function LeadsPage() {
    const stages = await getPipelineStages()
    const leads = await getLeads()

    // Count leads by status
    const leadCounts = stages.reduce((acc: Record<string, number>, stage: any) => {
        acc[stage.id] = leads.filter((l: any) => l.pipeline_stage_id === stage.id).length
        return acc
    }, {})

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 pb-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Funil de Vendas</h1>
                        <p className="text-sm text-zinc-500">Arraste os leads entre as etapas do funil</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <NewLeadDialog stages={stages} />
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Buscar lead..."
                                className="pl-9 h-9 bg-zinc-900/50 border-zinc-800"
                            />
                        </div>

                        {/* Filters */}
                        <Button variant="outline" size="sm" className="h-9 border-zinc-800 text-zinc-400">
                            <Filter className="h-4 w-4 mr-2" />
                            Filtros
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-zinc-500">
                            <span className="text-white font-medium">{leads.length}</span> leads total
                        </span>
                        {stages.slice(0, 3).map((stage: any) => (
                            <span key={stage.id} className="text-zinc-700">•</span>
                        ))}
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
            </div>

            {/* Kanban Container */}
            <Card className="flex-1 mx-6 mb-6 border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
                <div className="h-full p-4">
                    <LeadBoard stages={stages} leads={leads} />
                </div>
            </Card>
        </div>
    )
}
