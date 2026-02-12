'use client'

import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { login, signup } from '../actions'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Building2, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

                {/* Glow Effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 shadow-lg shadow-primary/20">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">CRM Imobiliário</h1>
                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Sistema Pro</p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-8">
                        <Feature
                            icon={Zap}
                            title="Gestão Inteligente"
                            description="Pipeline visual com drag & drop para gerenciar seus leads."
                        />
                        <Feature
                            icon={Shield}
                            title="100% Seguro"
                            description="Dados protegidos com criptografia de ponta."
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center bg-background p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[400px]"
                >
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-emerald-500">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg">CRM Imobiliário</span>
                    </div>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                            <TabsTrigger value="login" className="font-medium">Login</TabsTrigger>
                            <TabsTrigger value="register" className="font-medium">Cadastro</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        Entre com suas credenciais para acessar o sistema.
                                    </CardDescription>
                                </CardHeader>
                                <form action={async (formData) => {
                                    const res = await login(formData);
                                    if (res?.error) {
                                        toast.error(res.error);
                                    }
                                }}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="seu@email.com"
                                                required
                                                className="h-11 bg-muted/30 border-border/40 focus:border-primary/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Senha</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                className="h-11 bg-muted/30 border-border/40 focus:border-primary/50"
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <SubmitButton text="Entrar" loadingText="Entrando..." />
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>

                        <TabsContent value="register">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-xl">Criar Conta</CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        Comece a gerenciar seus leads gratuitamente.
                                    </CardDescription>
                                </CardHeader>
                                <form action={async (formData) => {
                                    const res = await signup(formData);
                                    if (res?.error) {
                                        toast.error(res.error);
                                    } else {
                                        toast.success('Conta criada! Faça login para continuar.');
                                    }
                                }}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Nome Completo</Label>
                                            <Input
                                                id="name"
                                                name="full_name"
                                                placeholder="João Silva"
                                                required
                                                className="h-11 bg-muted/30 border-border/40 focus:border-primary/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="register-email" className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</Label>
                                            <Input
                                                id="register-email"
                                                name="email"
                                                type="email"
                                                placeholder="seu@email.com"
                                                required
                                                className="h-11 bg-muted/30 border-border/40 focus:border-primary/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="register-password" className="text-xs uppercase tracking-wider text-muted-foreground">Senha</Label>
                                            <Input
                                                id="register-password"
                                                name="password"
                                                type="password"
                                                required
                                                className="h-11 bg-muted/30 border-border/40 focus:border-primary/50"
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <SubmitButton text="Criar Conta" loadingText="Criando..." />
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    )
}

function Feature({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

function SubmitButton({ text, loadingText }: { text: string; loadingText: string }) {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full h-11 font-medium group" type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                </>
            ) : (
                <>
                    {text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
            )}
        </Button>
    )
}
