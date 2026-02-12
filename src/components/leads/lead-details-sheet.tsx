'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { User, Phone, Mail, DollarSign, Calendar, Clock, Save, MessageSquare, History, TrendingUp, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

type Lead = {
    id: string
    name: string
    phone: string | null
    email: string | null
    interest_value: number | null
    notes: string | null
    stage_id: string | null
    created_at: string
}

type Interaction = {
    id: string
    type: string
    content: string
    created_at: string
}

// Styled Input Component
function StyledInput({ icon: Icon, label, ...props }: { icon: React.ElementType; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{label}</Label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                    <Icon className="h-4 w-4" />
                </div>
                <Input
                    {...props}
                    className="h-11 pl-10 bg-muted/30 border-border/40 focus:border-primary/50 focus:bg-muted/50 transition-all font-mono text-sm"
                />
            </div>
        </div>
    )
}

export function LeadDetailsSheet({ leadId, open, onOpenChange }: { leadId: string | null, open: boolean, onOpenChange: (open: boolean) => void }) {
    const [lead, setLead] = useState<Lead | null>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [interactions, setInteractions] = useState<Interaction[]>([])
    const supabase = createClient()

    useEffect(() => {
        if (leadId && open) {
            fetchLeadDetails(leadId)
        }
    }, [leadId, open])

    async function fetchLeadDetails(id: string) {
        setLoading(true)
        const { data, error } = await (supabase.from('leads') as any)
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            toast.error("Erro ao carregar lead")
        } else {
            setLead(data)
            fetchInteractions(id)
        }
        setLoading(false)
    }

    async function fetchInteractions(id: string) {
        const { data } = await (supabase.from('interactions') as any)
            .select('*')
            .eq('lead_id', id)
            .order('created_at', { ascending: false })

        if (data) setInteractions(data)
    }

    async function handleSave() {
        if (!lead) return
        setSaving(true)

        const { error } = await (supabase.from('leads') as any)
            .update({
                name: lead.name,
                phone: lead.phone,
                email: lead.email,
                interest_value: lead.interest_value,
                notes: lead.notes
            })
            .eq('id', lead.id)

        if (error) {
            toast.error("Erro ao salvar")
        } else {
            toast.success("Lead atualizado!")
            onOpenChange(false)
        }
        setSaving(false)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[420px] sm:w-[540px] overflow-hidden p-0 border-l-border/40 bg-background/95 backdrop-blur-xl">
                {/* Accessibility: Hidden title for screen readers */}
                <SheetHeader className="sr-only">
                    <SheetTitle>Detalhes do Lead</SheetTitle>
                    <SheetDescription>Visualize e edite as informações do cliente.</SheetDescription>
                </SheetHeader>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center h-full"
                        >
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </motion.div>
                    ) : lead ? (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col h-full"
                        >
                            {/* Header */}
                            <div className="relative px-6 pt-6 pb-4 border-b border-border/40">
                                {/* Background Glow */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

                                <div className="relative flex items-start gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-lg shadow-primary/10">
                                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary">
                                            {lead.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-bold truncate">{lead.name}</h2>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span className="font-mono">Criado em {new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        {lead.interest_value && (
                                            <Badge className="mt-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">
                                                <DollarSign className="h-3 w-3 mr-1" />
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.interest_value)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
                                <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border/40 bg-transparent h-12 p-0">
                                    <TabsTrigger
                                        value="details"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-full"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Dados
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="history"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-full"
                                    >
                                        <History className="h-4 w-4 mr-2" />
                                        Histórico
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="flex-1 overflow-y-auto p-6 space-y-5 mt-0">
                                    <StyledInput
                                        icon={User}
                                        label="Nome Completo"
                                        value={lead.name}
                                        onChange={e => setLead({ ...lead, name: e.target.value })}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <StyledInput
                                            icon={Phone}
                                            label="Telefone"
                                            value={lead.phone || ''}
                                            onChange={e => setLead({ ...lead, phone: e.target.value })}
                                        />
                                        <StyledInput
                                            icon={DollarSign}
                                            label="Valor Interesse"
                                            type="number"
                                            value={lead.interest_value || ''}
                                            onChange={e => setLead({ ...lead, interest_value: Number(e.target.value) })}
                                        />
                                    </div>

                                    <StyledInput
                                        icon={Mail}
                                        label="E-mail"
                                        type="email"
                                        value={lead.email || ''}
                                        onChange={e => setLead({ ...lead, email: e.target.value })}
                                    />

                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Anotações</Label>
                                        <Textarea
                                            rows={4}
                                            value={lead.notes || ''}
                                            onChange={e => setLead({ ...lead, notes: e.target.value })}
                                            className="bg-muted/30 border-border/40 focus:border-primary/50 focus:bg-muted/50 transition-all resize-none"
                                            placeholder="Adicione observações sobre este lead..."
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="history" className="flex-1 overflow-y-auto p-6 mt-0">
                                    {interactions.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                                                <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
                                            </div>
                                            <p className="text-sm text-muted-foreground/60 font-medium">Nenhuma interação registrada</p>
                                            <p className="text-xs text-muted-foreground/40 mt-1">As interações aparecerão aqui automaticamente</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {interactions.map((interaction, index) => (
                                                <motion.div
                                                    key={interaction.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="relative pl-6 pb-4 border-l-2 border-border/40 last:border-l-transparent"
                                                >
                                                    {/* Timeline Dot */}
                                                    <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                                                    <div className="bg-muted/20 rounded-lg p-3 border border-border/40">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{interaction.type}</span>
                                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                                {new Date(interaction.created_at).toLocaleString('pt-BR')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{interaction.content}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>

                            {/* Footer */}
                            <div className="p-4 border-t border-border/40 bg-muted/10">
                                <Button onClick={handleSave} disabled={saving} className="w-full h-11 font-medium group">
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Salvar Alterações
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </SheetContent>
        </Sheet>
    )
}
