import { getTasks } from "./actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckSquare, Clock, Phone, Mail, MessageCircle, Users, FileText, AlertCircle, Check, Filter } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const tipoIcons: Record<string, React.ElementType> = {
    ligacao: Phone,
    email: Mail,
    whatsapp: MessageCircle,
    reuniao: Users,
    documento: FileText,
    outro: CheckSquare,
}

const prioridadeConfig: Record<string, { label: string, color: string, dot: string }> = {
    baixa: { label: "Baixa", color: "text-zinc-400", dot: "bg-zinc-500" },
    media: { label: "Média", color: "text-sky-400", dot: "bg-sky-500" },
    alta: { label: "Alta", color: "text-amber-400", dot: "bg-amber-500" },
    urgente: { label: "Urgente", color: "text-rose-400", dot: "bg-rose-500" },
}

function isOverdue(date: string) {
    return new Date(date) < new Date()
}

export default async function TarefasPage() {
    const tasks = await getTasks('pending')

    const overdueTasks = tasks.filter((t: any) => t.data_vencimento && isOverdue(t.data_vencimento) && t.status === 'pendente')
    const upcomingTasks = tasks.filter((t: any) => !t.data_vencimento || !isOverdue(t.data_vencimento) || t.status !== 'pendente')
    const pendingCount = tasks.filter((t: any) => t.status === 'pendente').length

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Tarefas</h1>
                    <p className="text-sm text-zinc-500">Follow-ups e atividades</p>
                </div>
                <Link href="/tarefas/nova">
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Tarefa
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
                <span className="text-zinc-500">
                    <span className="text-white font-medium">{pendingCount}</span> pendentes
                </span>
                {overdueTasks.length > 0 && (
                    <>
                        <span className="text-zinc-700">•</span>
                        <span className="text-rose-400 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">{overdueTasks.length}</span> atrasadas
                        </span>
                    </>
                )}
            </div>

            {/* List */}
            {tasks.length === 0 ? (
                <Card className="bg-zinc-900/30 border-zinc-800/50">
                    <CardContent className="py-16 text-center">
                        <CheckSquare className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-sm font-medium text-white mb-1">Nenhuma tarefa pendente</h3>
                        <p className="text-xs text-zinc-500 mb-4">Crie uma tarefa de follow-up</p>
                        <Link href="/tarefas/nova">
                            <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Tarefa
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Overdue Section */}
                    {overdueTasks.length > 0 && (
                        <div>
                            <h3 className="text-xs font-medium text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Atrasadas
                            </h3>
                            <div className="space-y-2">
                                {overdueTasks.map((task: any) => (
                                    <TaskCard key={task.id} task={task} overdue />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Section */}
                    {upcomingTasks.length > 0 && (
                        <div>
                            {overdueTasks.length > 0 && (
                                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                                    Próximas
                                </h3>
                            )}
                            <div className="space-y-2">
                                {upcomingTasks.map((task: any) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function TaskCard({ task, overdue }: { task: any, overdue?: boolean }) {
    const TipoIcon = tipoIcons[task.tipo] || CheckSquare
    const prioridadeInfo = prioridadeConfig[task.prioridade] || prioridadeConfig.media

    return (
        <Card className={cn(
            "bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700 transition-all",
            overdue && "border-rose-500/30 bg-rose-500/5"
        )}>
            <CardContent className="flex items-center gap-4 p-4">
                {/* Icon */}
                <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    overdue ? "bg-rose-500/10" : "bg-sky-500/10"
                )}>
                    <TipoIcon className={cn("h-5 w-5", overdue ? "text-rose-400" : "text-sky-400")} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white truncate">{task.titulo}</h4>
                        <div className="flex items-center gap-1.5">
                            <div className={`h-2 w-2 rounded-full ${prioridadeInfo.dot}`} />
                            <span className={`text-xs ${prioridadeInfo.color}`}>{prioridadeInfo.label}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                        {task.client && <span>{task.client.nome}</span>}
                        {task.lead && <span>{task.lead.name}</span>}
                        {task.data_vencimento && (
                            <span className={cn("flex items-center gap-1", overdue && "text-rose-400")}>
                                <Clock className="h-3 w-3" />
                                {new Date(task.data_vencimento).toLocaleDateString('pt-BR')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Complete Button */}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10">
                    <Check className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    )
}
