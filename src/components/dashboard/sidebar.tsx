'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    Zap,
    ChevronRight,
    Building2,
    UserCheck,
    TrendingUp,
    Calendar,
    CheckSquare,
    Search,
    Bell,
    ChevronLeft
} from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Leads", href: "/leads", badge: "12" },
    { icon: UserCheck, label: "Clientes", href: "/clientes" },
    { icon: Building2, label: "Imóveis", href: "/imoveis" },
    { icon: TrendingUp, label: "Negócios", href: "/negocios" },
    { icon: Calendar, label: "Agenda", href: "/agenda" },
    { icon: CheckSquare, label: "Tarefas", href: "/tarefas" },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className={cn(
            "hidden border-r border-zinc-800/50 bg-zinc-900/30 md:flex flex-col transition-all duration-300",
            collapsed ? "md:w-16" : "md:w-60 lg:w-64"
        )}>
            {/* Logo Header */}
            <div className={cn(
                "h-14 flex items-center border-b border-zinc-800/50 transition-all",
                collapsed ? "px-3 justify-center" : "px-4 gap-3"
            )}>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-white" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="font-semibold text-white text-sm">CRM Imobiliário</h1>
                        <p className="text-[10px] text-zinc-500 font-medium">Pro Edition</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-0.5">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href))
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                                    collapsed && "justify-center",
                                    isActive
                                        ? "bg-sky-500/10 text-sky-400"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                )}
                                title={collapsed ? item.label : undefined}
                            >
                                {isActive && !collapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-sky-500" />
                                )}
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                {!collapsed && (
                                    <>
                                        <span className="flex-1">{item.label}</span>
                                        {item.badge && (
                                            <Badge className="bg-sky-500/20 text-sky-400 text-[10px] px-1.5 py-0 h-5">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Collapse Button */}
            <div className="p-2 border-t border-zinc-800/50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "w-full text-zinc-500 hover:text-white",
                        collapsed ? "justify-center" : "justify-start"
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            <span className="text-xs">Recolher</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 md:hidden h-9 w-9 text-zinc-400">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-zinc-900 border-zinc-800 p-0 w-64">
                {/* Logo */}
                <div className="h-14 flex items-center gap-3 px-4 border-b border-zinc-800">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-white">CRM Imobiliário</span>
                </div>

                <nav className="flex-1 p-2 space-y-0.5">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-sky-500/10 text-sky-400"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <Badge className="bg-sky-500/20 text-sky-400 text-[10px]">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export function TopBar() {
    return (
        <header className="h-14 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between px-4 lg:px-6">
            <MobileSidebar />

            {/* Search */}
            <div className="hidden md:flex relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                    placeholder="Buscar leads, clientes, imóveis..."
                    className="pl-9 h-9 bg-zinc-800/50 border-zinc-700/50 text-sm focus:border-zinc-600"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 ml-auto">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-white relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-sky-500 rounded-full" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-zinc-900 border-zinc-800">
                        <DropdownMenuLabel className="text-zinc-400 text-xs">
                            Notificações
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <div className="p-3 space-y-3">
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="h-4 w-4 text-sky-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-white">Novo lead recebido</p>
                                    <p className="text-xs text-zinc-500">João Silva - Via Instagram</p>
                                    <p className="text-[10px] text-zinc-600 mt-0.5">há 5 min</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="h-4 w-4 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-white">Visita agendada</p>
                                    <p className="text-xs text-zinc-500">Apto 301 - Hoje às 15h</p>
                                    <p className="text-[10px] text-zinc-600 mt-0.5">há 30 min</p>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <UserNav />
            </div>
        </header>
    )
}

export function UserNav() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })
    }, [supabase.auth])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    const initials = user?.email?.substring(0, 2).toUpperCase() || 'U'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-2 gap-2 text-zinc-400 hover:text-white">
                    <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-sky-500/20 text-sky-400 text-xs font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden md:block">
                        {user?.email?.split('@')[0] || 'Usuário'}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                <DropdownMenuLabel className="text-zinc-400 text-xs font-normal">
                    {user?.email || 'usuario@email.com'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-rose-400 focus:bg-zinc-800 cursor-pointer"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
