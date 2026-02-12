'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createVisit } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function NovaVisitaPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createVisit(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Visita agendada!")
            router.push('/agenda')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-full bg-zinc-950">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/50">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/agenda">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-white">Agendar Visita</h1>
                            <p className="text-xs text-zinc-500">Agende uma visita ao imóvel</p>
                        </div>
                    </div>
                    <Button type="submit" form="visit-form" disabled={loading} className="bg-sky-600 hover:bg-sky-700">
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Agendar
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-2xl mx-auto px-6 py-8">
                <form id="visit-form" action={handleSubmit} className="space-y-8">

                    {/* DateTime */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            Data e Hora
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="data_visita">Data e Hora *</Label>
                                <Input
                                    id="data_visita"
                                    name="data_visita"
                                    type="datetime-local"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duracao_minutos" className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    Duração
                                </Label>
                                <Select name="duracao_minutos" defaultValue="60">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="30">30 minutos</SelectItem>
                                        <SelectItem value="60">1 hora</SelectItem>
                                        <SelectItem value="90">1h30</SelectItem>
                                        <SelectItem value="120">2 horas</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            placeholder="Detalhes da visita, instruções de acesso, pontos de encontro..."
                        />
                    </section>

                    {/* Mobile Submit */}
                    <div className="flex gap-3 pt-4 lg:hidden">
                        <Link href="/agenda" className="flex-1">
                            <Button variant="outline" type="button" className="w-full">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="flex-1 bg-sky-600 hover:bg-sky-700">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Agendar
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
