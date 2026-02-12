'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { createLead } from "@/app/(dashboard)/leads/actions"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function NewLeadDialog({ stages }: { stages: any[] }) {
    const [open, setOpen] = useState(false)

    async function handleSubmit(formData: FormData) {
        const res = await createLead(formData)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Lead criado com sucesso!")
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Lead</DialogTitle>
                    <DialogDescription>
                        Insira os dados do novo cliente para o funil.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nome
                            </Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Telefone
                            </Label>
                            <Input id="phone" name="phone" className="col-span-3" placeholder="(11) 99999-9999" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stage" className="text-right">
                                Etapa
                            </Label>
                            <div className="col-span-3">
                                <Select name="stage_id" required defaultValue={stages[0]?.id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a etapa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stages.map((stage) => (
                                            <SelectItem key={stage.id} value={stage.id}>
                                                {stage.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Salvar Lead</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
