import { checkSaaSAdmin } from "@/app/admin-saas/actions"
import AdminLayoutClient from "@/app/admin-saas/AdminLayoutClient"
import React from 'react'
import { redirect } from "next/navigation"

export default async function AdminSaasLayout({ children }: { children: React.ReactNode }) {
    // 1. Mandatory Security Check
    const result = await checkSaaSAdmin()

    // 2. Production Flow
    // If checkSaaSAdmin returns diagnostic data (isError), we redirect to login or CRM
    if ('isError' in result && result.isError) {
        // If not authenticated, redirect to admin login
        if (result.data.message === "User not authenticated") {
            redirect('/admin-saas/login')
        }
        // If authenticated but not authorized, redirect to CRM
        redirect('/')
    }

    const { user } = result as any

    // @ts-ignore - The user returned by checkSaaSAdmin is the auth user
    return (
        <AdminLayoutClient userEmail={user.email}>
            {children}
        </AdminLayoutClient>
    )
}
