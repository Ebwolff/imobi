'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Phone, Mail, MessageCircle, Users, FileText, CheckSquare, Calendar, Flag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createTask } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const tipoOptions = [
    { value: 'ligacao', label: 'Ligação', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { value: 'reuniao', label: 'Reunião', icon: Users },
    { value: 'documento', label: 'Documento', icon: FileText },
    { value: 'outro', label: 'Outro', icon: CheckSquare },
]

const prioridadeOptions = [
    { value: 'baixa', label: 'Baixa', color: 'text-zinc-400' },
    { value: 'media', label: 'Média', color: 'text-sky-400' },
    { value: 'alta', label: 'Alta', color: 'text-amber-400' },
    { value: 'urgente', label: 'Urgente', color: 'text-rose-400' },
]

export default function NovaTarefaPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createTask(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Tarefa criada!")
            router.push('/tarefas')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-full bg-zinc-950">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/50">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/tarefas">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-white">Nova Tarefa</h1>
                            <p className="text-xs text-zinc-500">Crie um follow-up ou atividade</p>
                        </div>
                    </div>
                    <Button type="submit" form="task-form" disabled={loading} className="bg-sky-600 hover:bg-sky-700">
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
                <form id="task-form" action={handleSubmit} className="space-y-8">

                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Detalhes da Tarefa</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="titulo">Título *</Label>
                                <Input
                                    id="titulo"
                                    name="titulo"
                                    placeholder="Ex: Ligar para João sobre proposta"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tipo">Tipo</Label>
                                    <Select name="tipo" defaultValue="ligacao">
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
                                <div className="space-y-2">
                                    <Label htmlFor="prioridade" className="flex items-center gap-2">
                                        <Flag className="h-3 w-3" />
                                        Prioridade
                                    </Label>
                                    <Select name="prioridade" defaultValue="media">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {prioridadeOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <span className={opt.color}>{opt.label}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="data_vencimento" className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    Data de Vencimento
                                </Label>
                                <Input
                                    id="data_vencimento"
                                    name="data_vencimento"
                                    type="datetime-local"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-zinc-800/50" />

                    {/* Description */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Descrição</h2>

                        <Textarea
                            name="descricao"
                            rows={4}
                            placeholder="Detalhes sobre a tarefa, contexto, próximos passos..."
                        />
                    </section>

                    {/* Mobile Submit */}
                    <div className="flex gap-3 pt-4 lg:hidden">
                        <Link href="/tarefas" className="flex-1">
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
