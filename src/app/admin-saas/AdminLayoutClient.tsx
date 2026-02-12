'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    LayoutDashboard,
    Building2,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    Users,
    Activity,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutSaas } from "./auth-actions"

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin-saas" },
    { icon: Building2, label: "Clientes", href: "/admin-saas/tenants" },
    { icon: CreditCard, label: "Planos", href: "/admin-saas/plans" },
    { icon: Users, label: "Assinaturas", href: "/admin-saas/subscriptions" },
    { icon: Activity, label: "Monitoramento", href: "/admin-saas/monitoring" },
    { icon: FileText, label: "Logs", href: "/admin-saas/logs" },
    { icon: Settings, label: "Configurações", href: "/admin-saas/settings" },
]

export default function AdminLayoutClient({
    children,
    userEmail
}: {
    children: React.ReactNode,
    userEmail?: string
}) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    // Don't show layout on login page
    if (pathname === '/admin-saas/login') return <>{children}</>

    return (
        <div className="flex h-screen bg-zinc-950">
            {/* Sidebar */}
            <aside className={cn(
                "border-r border-zinc-800/50 bg-zinc-900/30 flex flex-col transition-all duration-300",
                collapsed ? "w-16" : "w-60"
            )}>
                {/* Logo */}
                <div className={cn(
                    "h-14 flex items-center border-b border-zinc-800/50 transition-all",
                    collapsed ? "px-3 justify-center" : "px-4 gap-3"
                )}>
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <h1 className="font-semibold text-white text-sm">SaaS Master</h1>
                            <p className="text-[10px] text-zinc-500 font-medium">Control Plane</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin-saas' && pathname.startsWith(item.href))
                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        collapsed && "justify-center",
                                        isActive
                                            ? "bg-amber-500/10 text-amber-500"
                                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                    )}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon className="h-4 w-4 flex-shrink-0" />
                                    {!collapsed && <span>{item.label}</span>}
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
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-14 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between px-6">
                    {/* Search */}
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Buscar clientes, planos..."
                            className="pl-9 h-9 bg-zinc-800/50 border-zinc-700/50 text-sm focus:border-zinc-600"
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-white relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-amber-500 rounded-full" />
                        </Button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 px-2 gap-2 text-zinc-400 hover:text-white">
                                    <div className="h-7 w-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                                        <span className="text-amber-500 font-semibold text-xs">M</span>
                                    </div>
                                    <span className="text-sm font-medium hidden md:block">Eberscaow Master</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Owner</span>
                                    <span className="text-sm text-zinc-300 truncate">{userEmail || 'eberscaow@gmail.com'}</span>
                                </div>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 cursor-pointer">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configurações
                                </DropdownMenuItem>
                                <form action={logoutSaas}>
                                    <DropdownMenuItem className="text-rose-400 focus:bg-zinc-800 cursor-pointer p-0">
                                        <button className="flex items-center w-full px-2 py-1.5 h-full">
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sair
                                        </button>
                                    </DropdownMenuItem>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-zinc-950">
                    {children}
                </main>
            </div>
        </div>
    )
}
