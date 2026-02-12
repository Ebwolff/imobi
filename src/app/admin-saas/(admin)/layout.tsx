import { checkSaaSAdmin } from "@/app/admin-saas/actions"
import AdminLayoutClient from "@/app/admin-saas/AdminLayoutClient"
import React from 'react'

export default async function AdminSaasLayout({ children }: { children: React.ReactNode }) {
    // 1. Mandatory Security Check
    // This will redirect to login if not authenticated or to / if not authorized
    const user = await checkSaaSAdmin()

    // @ts-ignore - The user returned by checkSaaSAdmin is the auth user
    return (
        <AdminLayoutClient userEmail={user.email}>
            {children}
        </AdminLayoutClient>
    )
}
