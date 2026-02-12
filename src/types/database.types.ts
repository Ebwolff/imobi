export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    role: 'admin' | 'corretor'
                    phone: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'corretor'
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'corretor'
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            leads: {
                Row: {
                    id: string
                    user_id: string | null
                    stage_id: string | null
                    name: string
                    email: string | null
                    phone: string | null
                    source: string | null
                    interest_type: string | null
                    interest_value: number | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    stage_id?: string | null
                    name: string
                    email?: string | null
                    phone?: string | null
                    source?: string | null
                    interest_type?: string | null
                    interest_value?: number | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    stage_id?: string | null
                    name?: string
                    email?: string | null
                    phone?: string | null
                    source?: string | null
                    interest_type?: string | null
                    interest_value?: number | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            pipelines: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                }
            }
            pipeline_stages: {
                Row: {
                    id: string
                    pipeline_id: string
                    name: string
                    position: number
                    color: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    pipeline_id: string
                    name: string
                    position?: number
                    color?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    pipeline_id?: string
                    name?: string
                    position?: number
                    color?: string | null
                    created_at?: string
                }
            }
        }
    }
}
