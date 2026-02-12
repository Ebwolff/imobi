'use client'

import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { loginSaas } from '../auth-actions'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Shield, Lock, ArrowRight, Loader2, Globe } from 'lucide-react'

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020202] relative overflow-hidden">
            {/* Dark Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_50%)]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[420px] relative z-10 p-6"
            >
                {/* Master Logo */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
                        <Globe className="h-8 w-8 text-amber-500" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Master Admin</h1>
                        <p className="text-xs text-amber-500/60 font-mono uppercase tracking-[0.2em] mt-1">SaaS Infrastructure</p>
                    </div>
                </div>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl shadow-black">
                    <CardHeader className="space-y-1 text-center pb-8 border-b border-zinc-800/50 mb-6">
                        <CardTitle className="text-xl text-white">Acesso Restrito</CardTitle>
                        <CardDescription className="text-zinc-500">
                            Identifique-se para gerenciar o ecossistema.
                        </CardDescription>
                    </CardHeader>
                    <form action={async (formData) => {
                        const res = await loginSaas(formData);
                        if (res?.error) {
                            toast.error(res.error);
                        }
                    }}>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">E-mail Administrativo</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@master.com"
                                        required
                                        className="h-12 pl-10 bg-zinc-950/50 border-zinc-800 focus:border-amber-500/50 focus:ring-amber-500/10 transition-all text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Senha Mestra</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="h-12 pl-10 bg-zinc-950/50 border-zinc-800 focus:border-amber-500/50 focus:ring-amber-500/10 transition-all text-white"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-4">
                            <SubmitButton />
                        </CardFooter>
                    </form>
                </Card>

                {/* Secure Badge */}
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                    <Lock className="h-3 w-3" />
                    <span>Conexão Segura AES-256</span>
                </div>
            </motion.div>
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full h-12 font-bold bg-amber-600 hover:bg-amber-500 text-white border-zinc-900 group shadow-lg shadow-amber-950/20" type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                </>
            ) : (
                <>
                    Entrar no Painel Master
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
            )}
        </Button>
    )
}
