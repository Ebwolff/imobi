import { checkSaaSAdmin } from "@/app/admin-saas/actions"
import AdminLayoutClient from "@/app/admin-saas/AdminLayoutClient"
import React from 'react'
import { redirect } from "next/navigation"

export default async function AdminSaasLayout({ children }: { children: React.ReactNode }) {
    // 1. Mandatory Security Check
    const result = await checkSaaSAdmin()

    // 2. Safety Branch
    // If it's an error object, we handle redirects
    if ('isError' in result && result.isError) {
        if (result.data?.message === "User not authenticated") {
            redirect('/admin-saas/login')
        }
        // Case: Authenticated but not in saas_users or wrong role
        redirect('/')
    }

    // 3. Success Branch
    // At this point, result MUST contain the user object
    const user = (result as any).user

    if (!user || !user.email) {
        redirect('/admin-saas/login')
    }

    return (
        <AdminLayoutClient userEmail={user.email}>
            {children}
        </AdminLayoutClient>
    )
}
