'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDraggable, useDroppable, defaultDropAnimationSideEffects, DropAnimation, UniqueIdentifier } from "@dnd-kit/core"
import { useState, useId } from "react"
import { updateLeadStage } from "@/app/(dashboard)/leads/actions"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, Phone, MoreHorizontal, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { LeadDetailsSheet } from "./lead-details-sheet"

type Stage = {
    id: string
    name: string
    color: string | null
}

type Lead = {
    id: string
    name: string
    phone: string | null
    interest_value: number | null
    stage_id: string | null
}

// Custom Drop Animation for "Game Feel"
const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
}

function DraggableLead({ lead, onClick }: { lead: Lead, onClick?: () => void }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: lead.id,
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${isDragging ? 1.05 : 1})`,
        zIndex: isDragging ? 100 : 1,
        // Add a slight tilt when dragging for "juice"
        rotate: isDragging ? `${transform.x * 0.05}deg` : '0deg',
    } : undefined

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={onClick} className="touch-none">
            <LeadCard lead={lead} isDragging={isDragging} />
        </div>
    )
}

function LeadCard({ lead, isDragging, onClick }: { lead: Lead, isDragging?: boolean, onClick?: () => void }) {
    return (
        <motion.div
            layoutId={lead.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, borderColor: "rgba(52, 211, 153, 0.5)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "group relative overflow-hidden rounded-lg border bg-zinc-800/50 text-white shadow-sm transition-all",
                isDragging ? "shadow-2xl border-sky-500/50 ring-2 ring-sky-500/20 rotate-2 cursor-grabbing" : "cursor-grab hover:shadow-md border-zinc-700/60"
            )}
            onClick={onClick}
        >
            {/* Cyber Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/20 to-transparent group-hover:via-emerald-500/80 transition-all duration-500" />

            <CardHeader className="p-3 pb-1 pl-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold leading-none truncate font-mono tracking-tight text-white group-hover:text-sky-400 transition-colors">
                    {lead.name}
                </CardTitle>
                <GripVertical className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardHeader>
            <CardContent className="p-3 pt-2 pl-4 text-xs text-muted-foreground">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-muted-foreground/70" />
                        <span className="font-mono text-[10px] tracking-wider opacity-80">{lead.phone || 'N/A'}</span>
                    </div>
                    {lead.interest_value && (
                        <div className="flex items-center gap-1.5 mt-1 bg-emerald-500/10 w-fit px-1.5 py-0.5 rounded-sm border border-emerald-500/20">
                            <DollarSign className="h-3 w-3 text-emerald-500" />
                            <span className="font-bold text-emerald-500 font-mono">
                                {new Intl.NumberFormat('pt-BR', { notation: "compact", compactDisplay: "short", style: 'currency', currency: 'BRL' }).format(lead.interest_value)}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </motion.div>
    )
}

function DroppableStage({ stage, count, children }: { stage: Stage, count: number, children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
        id: stage.id,
    })

    return (
        <div ref={setNodeRef} className={cn(
            "min-w-[260px] max-w-[300px] flex-1 shrink-0 flex flex-col gap-2 h-full transition-colors rounded-lg p-1",
            isOver ? "bg-primary/5 ring-1 ring-primary/20" : ""
        )}>
            <div className="flex items-center justify-between px-2 py-3 border-b border-border/40 bg-muted/20 rounded-t-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", isOver ? "bg-primary animate-pulse" : "bg-muted-foreground/50")} />
                    <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground">{stage.name}</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary/80 bg-primary/5">{count}</Badge>
            </div>

            <ScrollArea className="h-full">
                <div className="flex flex-col gap-2 p-1 min-h-[150px]">
                    {children}
                </div>
            </ScrollArea>
        </div>
    )
}

export function LeadBoard({ stages, leads: initialLeads }: { stages: Stage[], leads: Lead[] }) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads)
    const [activeId, setActiveId] = useState<string | null>(null)

    // Sheet state
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)

    // Stable ID for DnD to avoid hydration mismatch
    const dndId = useId()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveId(null)

        if (over && active.id !== over.id) {
            const leadId = active.id as string
            const newStageId = over.id as string

            // Optimistic Update
            const previousLeads = [...leads]
            setLeads((leads) =>
                leads.map(lead =>
                    lead.id === leadId ? { ...lead, stage_id: newStageId } : lead
                )
            )

            // Server Update
            const result = await updateLeadStage(leadId, newStageId)
            if (result?.error) {
                toast.error(result.error)
                setLeads(previousLeads) // Revert on error
            }
        }
    }

    function handleCardClick(leadId: string) {
        if (activeId) return; // Don't open if dragging
        setSelectedLeadId(leadId)
        setSheetOpen(true)
    }

    const activeLead = leads.find(l => l.id === activeId)

    return (
        <DndContext id={dndId} sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                {stages.map((stage) => {
                    const stageLeads = leads.filter(lead => lead.stage_id === stage.id)
                    return (
                        <DroppableStage key={stage.id} stage={stage} count={stageLeads.length}>
                            <AnimatePresence mode='popLayout'>
                                {stageLeads.map((lead) => (
                                    <DraggableLead key={lead.id} lead={lead} onClick={() => handleCardClick(lead.id)} />
                                ))}
                            </AnimatePresence>
                            {stageLeads.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center p-8 text-xs text-muted-foreground/30 border-2 border-dashed border-muted-foreground/10 rounded-sm"
                                >
                                    <span className="uppercase tracking-widest font-mono text-[10px]">Vazio</span>
                                </motion.div>
                            )}
                        </DroppableStage>
                    )
                })}
            </div>
            <DragOverlay dropAnimation={dropAnimation}>
                {activeLead ? <LeadCard lead={activeLead} isDragging /> : null}
            </DragOverlay>

            <LeadDetailsSheet leadId={selectedLeadId} open={sheetOpen} onOpenChange={setSheetOpen} />
        </DndContext>
    )
}
