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
                    tenant_id: string | null
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
                    tenant_id?: string | null
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
                    tenant_id?: string | null
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
            clients: {
                Row: {
                    id: string
                    user_id: string | null
                    lead_id: string | null
                    nome: string
                    email: string | null
                    telefone: string | null
                    cpf: string | null
                    tipo: string
                    endereco: string | null
                    bairro: string | null
                    cidade: string | null
                    estado: string
                    observacoes: string | null
                    ativo: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    lead_id?: string | null
                    nome: string
                    email?: string | null
                    telefone?: string | null
                    cpf?: string | null
                    tipo?: string
                    endereco?: string | null
                    bairro?: string | null
                    cidade?: string | null
                    estado?: string
                    observacoes?: string | null
                    ativo?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    lead_id?: string | null
                    nome?: string
                    email?: string | null
                    telefone?: string | null
                    cpf?: string | null
                    tipo?: string
                    endereco?: string | null
                    bairro?: string | null
                    cidade?: string | null
                    estado?: string
                    observacoes?: string | null
                    ativo?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            tenants: {
                Row: {
                    id: string
                    nome_empresa: string
                    email_principal: string
                    cnpj: string | null
                    plano: string
                    slug: string
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nome_empresa: string
                    email_principal: string
                    cnpj?: string | null
                    plano?: string
                    slug: string
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nome_empresa?: string
                    email_principal?: string
                    cnpj?: string | null
                    plano?: string
                    slug?: string
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            plans: {
                Row: {
                    id: string
                    nome: string
                    slug: string
                    valor_mensal: number
                    limite_usuarios: number
                    limite_leads: number
                    limite_automacoes: number | null
                    limite_integracoes: number | null
                    ativo: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    nome: string
                    slug: string
                    valor_mensal: number
                    limite_usuarios?: number
                    limite_leads?: number
                    limite_automacoes?: number | null
                    limite_integracoes?: number | null
                    ativo?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    nome?: string
                    slug?: string
                    valor_mensal?: number
                    limite_usuarios?: number
                    limite_leads?: number
                    limite_automacoes?: number | null
                    limite_integracoes?: number | null
                    ativo?: boolean
                    created_at?: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    tenant_id: string
                    plan_id: string
                    status: 'ativa' | 'cancelada' | 'inadimplente' | 'trial'
                    data_inicio: string
                    data_fim: string | null
                    valor: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    plan_id: string
                    status?: 'ativa' | 'cancelada' | 'inadimplente' | 'trial'
                    data_inicio: string
                    data_fim?: string | null
                    valor?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    plan_id?: string
                    status?: 'ativa' | 'cancelada' | 'inadimplente' | 'trial'
                    data_inicio?: string
                    data_fim?: string | null
                    valor?: number | null
                    created_at?: string
                }
            }
            audit_logs: {
                Row: {
                    id: string
                    tenant_id: string | null
                    saas_user_id: string | null
                    acao: string
                    entidade: string | null
                    entidade_id: string | null
                    detalhes: Json | null
                    ip: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id?: string | null
                    saas_user_id?: string | null
                    acao: string
                    entidade?: string | null
                    entidade_id?: string | null
                    detalhes?: Json | null
                    ip?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string | null
                    saas_user_id?: string | null
                    acao?: string
                    entidade?: string | null
                    entidade_id?: string | null
                    detalhes?: Json | null
                    ip?: string | null
                    created_at?: string
                }
            }
            saas_users: {
                Row: {
                    id: string
                    email: string
                    nome: string
                    senha_hash: string
                    role: 'owner' | 'admin_saas' | 'suporte'
                    ativo: boolean
                    last_login: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    nome: string
                    senha_hash: string
                    role?: 'owner' | 'admin_saas' | 'suporte'
                    ativo?: boolean
                    last_login?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    nome?: string
                    senha_hash?: string
                    role?: 'owner' | 'admin_saas' | 'suporte'
                    ativo?: boolean
                    last_login?: string | null
                    created_at?: string
                }
            }
            properties: {
                Row: {
                    id: string
                    user_id: string | null
                    tenant_id: string | null
                    titulo: string
                    tipo: string
                    finalidade: string
                    endereco: string | null
                    bairro: string | null
                    cidade: string
                    estado: string
                    area_total: number | null
                    quartos: number
                    banheiros: number
                    vagas: number
                    valor: number
                    descricao: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    tenant_id?: string | null
                    titulo: string
                    tipo: string
                    finalidade?: string
                    endereco?: string | null
                    bairro?: string | null
                    cidade: string
                    estado?: string
                    area_total?: number | null
                    quartos?: number
                    banheiros?: number
                    vagas?: number
                    valor: number
                    descricao?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    tenant_id?: string | null
                    titulo?: string
                    tipo?: string
                    finalidade?: string
                    endereco?: string | null
                    bairro?: string | null
                    cidade?: string
                    estado?: string
                    area_total?: number | null
                    quartos?: number
                    banheiros?: number
                    vagas?: number
                    valor?: number
                    descricao?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            deals: {
                Row: {
                    id: string
                    user_id: string | null
                    tenant_id: string | null
                    client_id: string | null
                    property_id: string | null
                    titulo: string
                    tipo: string
                    valor_proposta: number | null
                    comissao_percentual: number
                    comissao_valor: number | null
                    status: string
                    data_prevista_fechamento: string | null
                    data_fechamento: string | null
                    motivo_perda: string | null
                    observacoes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    tenant_id?: string | null
                    client_id?: string | null
                    property_id?: string | null
                    titulo: string
                    tipo?: string
                    valor_proposta?: number | null
                    comissao_percentual?: number
                    comissao_valor?: number | null
                    status?: string
                    data_prevista_fechamento?: string | null
                    data_fechamento?: string | null
                    motivo_perda?: string | null
                    observacoes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    tenant_id?: string | null
                    client_id?: string | null
                    property_id?: string | null
                    titulo?: string
                    tipo?: string
                    valor_proposta?: number | null
                    comissao_percentual?: number
                    comissao_valor?: number | null
                    status?: string
                    data_prevista_fechamento?: string | null
                    data_fechamento?: string | null
                    motivo_perda?: string | null
                    observacoes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    user_id: string | null
                    tenant_id: string | null
                    client_id: string | null
                    lead_id: string | null
                    deal_id: string | null
                    titulo: string
                    descricao: string | null
                    tipo: string
                    prioridade: string
                    data_vencimento: string | null
                    data_conclusao: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    tenant_id?: string | null
                    client_id?: string | null
                    lead_id?: string | null
                    deal_id?: string | null
                    titulo: string
                    descricao?: string | null
                    tipo?: string
                    prioridade?: string
                    data_vencimento?: string | null
                    data_conclusao?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    tenant_id?: string | null
                    client_id?: string | null
                    lead_id?: string | null
                    deal_id?: string | null
                    titulo?: string
                    descricao?: string | null
                    tipo?: string
                    prioridade?: string
                    data_vencimento?: string | null
                    data_conclusao?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            visits: {
                Row: {
                    id: string
                    user_id: string | null
                    tenant_id: string | null
                    client_id: string | null
                    property_id: string | null
                    data_visita: string
                    duracao_minutos: number
                    feedback: string | null
                    observacoes: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    tenant_id?: string | null
                    client_id?: string | null
                    property_id?: string | null
                    data_visita: string
                    duracao_minutos?: number
                    feedback?: string | null
                    observacoes?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    tenant_id?: string | null
                    client_id?: string | null
                    property_id?: string | null
                    data_visita?: string
                    duracao_minutos?: number
                    feedback?: string | null
                    observacoes?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            interactions: {
                Row: {
                    id: string
                    lead_id: string
                    type: string
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    lead_id: string
                    type: string
                    content: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    lead_id?: string
                    type?: string
                    content?: string
                    created_at?: string
                }
            }
        }
    }
}
