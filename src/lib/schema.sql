-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 0. TENANTS (Multi-Tenant SaaS Core)
create table public.tenants (
  id uuid default uuid_generate_v4() primary key,
  nome_empresa text not null,
  slug text unique not null,
  cnpj text,
  email_principal text not null,
  logo_url text,
  plano text default 'free' check (plano in ('free', 'starter', 'pro', 'enterprise')),
  status text default 'ativo' check (status in ('ativo', 'suspenso', 'cancelado')),
  config jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tenants enable row level security;
create policy "tenants_select" on tenants for select using (auth.role() = 'authenticated');

-- =============================================
-- ADMIN SAAS TABLES (Owner/Master Panel)
-- =============================================

-- SAAS_USERS (Admin Users - NOT tenants)
create table public.saas_users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  nome text not null,
  senha_hash text not null,
  role text check (role in ('owner', 'admin_saas', 'suporte')) default 'suporte',
  ativo boolean default true,
  last_login timestamptz,
  created_at timestamptz default now()
);

-- PLANS (SaaS Pricing Plans)
create table public.plans (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  slug text unique not null,
  descricao text,
  valor_mensal numeric not null default 0,
  limite_usuarios integer default 5,
  limite_leads integer default 500,
  limite_automacoes integer default 10,
  limite_integracoes integer default 3,
  features jsonb default '[]',
  ativo boolean default true,
  created_at timestamptz default now()
);

-- SUBSCRIPTIONS (Tenant Subscriptions)
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references tenants(id) on delete cascade not null,
  plan_id uuid references plans(id) not null,
  status text check (status in ('ativa', 'cancelada', 'inadimplente', 'trial', 'expirada')) default 'trial',
  data_inicio date not null default current_date,
  data_fim date,
  valor numeric,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AUDIT_LOGS (Global Audit Trail)
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references tenants(id),
  user_id uuid,
  saas_user_id uuid references saas_users(id),
  acao text not null,
  entidade text,
  entidade_id uuid,
  detalhes jsonb,
  ip text,
  user_agent text,
  created_at timestamptz default now()
);

-- RLS for Admin Tables (no tenant isolation - admin only)
alter table public.saas_users enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_logs enable row level security;

-- Plans are publicly readable
create policy "plans_select" on plans for select using (true);

-- =============================================
-- END ADMIN SAAS TABLES
-- =============================================

-- 1. PROFILES (Linked to Auth + Tenant)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  tenant_id uuid references public.tenants(id),
  email text not null,
  full_name text,
  avatar_url text,
  role text check (role in ('admin', 'gestor', 'corretor')) default 'corretor',
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- 2. PIPELINES (Funis de Venda)
create table public.pipelines (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pipelines enable row level security;
create policy "Authenticated users can view pipelines" on pipelines for select using (auth.role() = 'authenticated');

-- 3. PIPELINE STAGES (Etapas do Funil)
create table public.pipeline_stages (
  id uuid default uuid_generate_v4() primary key,
  pipeline_id uuid references public.pipelines(id) on delete cascade not null,
  name text not null, -- ex: "Novo Lead", "Visita", "Proposta"
  position integer not null default 0, -- para ordenação no Kanban
  color text default '#cbd5e1',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pipeline_stages enable row level security;
create policy "Authenticated users can view stages" on pipeline_stages for select using (auth.role() = 'authenticated');

-- 4. LEADS
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id), -- Corretor responsável
  stage_id uuid references public.pipeline_stages(id), -- Etapa atual
  
  name text not null,
  email text,
  phone text,
  source text default 'manual', -- 'instagram', 'whatsapp', 'manual', 'site'
  interest_type text, -- 'compra', 'aluguel'
  interest_value numeric, -- valor aproximado
  notes text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.leads enable row level security;

-- Policy: Admin vê tudo, Corretor vê apenas seus leads (exemplo simples, pode ser expandido)
create policy "Participantes veem leads" 
  on leads for select 
  using (auth.role() = 'authenticated');

create policy "Corretores criam leads" 
  on leads for insert 
  with check (auth.role() = 'authenticated');

create policy "Corretores editam seus leads" 
  on leads for update 
  using (auth.role() = 'authenticated');

-- 5. INTERACTIONS (Histórico)
create table public.interactions (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references public.leads(id) on delete cascade not null,
  user_id uuid references public.profiles(id), -- Quem interagiu
  
  type text not null, -- 'note', 'call', 'meeting', 'whatsapp', 'email'
  content text,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.interactions enable row level security;
create policy "Participantes veem interacoes" on interactions for select using (auth.role() = 'authenticated');
create policy "Participantes criam interacoes" on interactions for insert with check (auth.role() = 'authenticated');

-- 6. PROPERTIES (Imóveis)
create table public.properties (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id), -- Corretor responsável
  
  titulo text not null,
  tipo text check (tipo in ('casa', 'apartamento', 'terreno', 'comercial', 'rural')) not null,
  finalidade text check (finalidade in ('venda', 'aluguel', 'ambos')) default 'venda',
  
  endereco text,
  bairro text,
  cidade text not null,
  estado text default 'SP',
  cep text,
  
  area_total numeric, -- m²
  area_construida numeric,
  quartos integer default 0,
  banheiros integer default 0,
  vagas integer default 0,
  
  valor numeric not null,
  valor_condominio numeric,
  valor_iptu numeric,
  
  descricao text,
  fotos text[], -- array de URLs
  
  status text check (status in ('disponivel', 'reservado', 'vendido', 'alugado', 'inativo')) default 'disponivel',
  destaque boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.properties enable row level security;
create policy "Participantes veem imoveis" on properties for select using (auth.role() = 'authenticated');
create policy "Participantes criam imoveis" on properties for insert with check (auth.role() = 'authenticated');
create policy "Participantes editam imoveis" on properties for update using (auth.role() = 'authenticated');
create policy "Participantes deletam imoveis" on properties for delete using (auth.role() = 'authenticated');

-- 7. CLIENTS (Leads Qualificados / Clientes)
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id), -- Corretor responsável
  lead_id uuid references public.leads(id), -- Lead de origem (opcional)
  
  nome text not null,
  email text,
  telefone text,
  cpf text,
  
  tipo text check (tipo in ('comprador', 'vendedor', 'locatario', 'locador')) default 'comprador',
  
  endereco text,
  bairro text,
  cidade text,
  estado text default 'SP',
  
  observacoes text,
  ativo boolean default true,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.clients enable row level security;
create policy "Participantes veem clientes" on clients for select using (auth.role() = 'authenticated');
create policy "Participantes criam clientes" on clients for insert with check (auth.role() = 'authenticated');
create policy "Participantes editam clientes" on clients for update using (auth.role() = 'authenticated');
create policy "Participantes deletam clientes" on clients for delete using (auth.role() = 'authenticated');

-- 8. DEALS (Negociações)
create table public.deals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id), -- Corretor responsável
  client_id uuid references public.clients(id), -- Cliente envolvido
  property_id uuid references public.properties(id), -- Imóvel da negociação
  lead_id uuid references public.leads(id), -- Lead de origem (opcional)
  
  titulo text not null,
  tipo text check (tipo in ('venda', 'aluguel')) default 'venda',
  
  valor_proposta numeric,
  valor_final numeric,
  comissao_percentual numeric default 6.0,
  comissao_valor numeric,
  
  status text check (status in ('aberta', 'negociando', 'proposta', 'fechada_ganha', 'fechada_perdida', 'cancelada')) default 'aberta',
  motivo_perda text,
  
  data_prevista_fechamento date,
  data_fechamento date,
  
  observacoes text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.deals enable row level security;
create policy "Participantes veem deals" on deals for select using (auth.role() = 'authenticated');
create policy "Participantes criam deals" on deals for insert with check (auth.role() = 'authenticated');
create policy "Participantes editam deals" on deals for update using (auth.role() = 'authenticated');
create policy "Participantes deletam deals" on deals for delete using (auth.role() = 'authenticated');

-- 9. VISITS (Visitas Agendadas)
create table public.visits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id), -- Corretor responsável
  client_id uuid references public.clients(id),
  property_id uuid references public.properties(id),
  lead_id uuid references public.leads(id),
  deal_id uuid references public.deals(id),
  
  data_visita timestamp with time zone not null,
  duracao_minutos integer default 60,
  
  status text check (status in ('agendada', 'confirmada', 'realizada', 'cancelada', 'remarcada')) default 'agendada',
  
  endereco_alternativo text,
  observacoes text,
  feedback text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.visits enable row level security;
create policy "Participantes veem visitas" on visits for select using (auth.role() = 'authenticated');
create policy "Participantes criam visitas" on visits for insert with check (auth.role() = 'authenticated');
create policy "Participantes editam visitas" on visits for update using (auth.role() = 'authenticated');
create policy "Participantes deletam visitas" on visits for delete using (auth.role() = 'authenticated');

-- 10. TASKS (Tarefas / Follow-ups)
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id), -- Responsável
  lead_id uuid references public.leads(id),
  client_id uuid references public.clients(id),
  deal_id uuid references public.deals(id),
  
  titulo text not null,
  descricao text,
  
  tipo text check (tipo in ('ligacao', 'email', 'whatsapp', 'reuniao', 'documento', 'outro')) default 'ligacao',
  prioridade text check (prioridade in ('baixa', 'media', 'alta', 'urgente')) default 'media',
  
  data_vencimento timestamp with time zone,
  data_conclusao timestamp with time zone,
  
  status text check (status in ('pendente', 'em_andamento', 'concluida', 'cancelada')) default 'pendente',
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;
create policy "Participantes veem tasks" on tasks for select using (auth.role() = 'authenticated');
create policy "Participantes criam tasks" on tasks for insert with check (auth.role() = 'authenticated');
create policy "Participantes editam tasks" on tasks for update using (auth.role() = 'authenticated');
create policy "Participantes deletam tasks" on tasks for delete using (auth.role() = 'authenticated');

-- FUNÇÃO TRIGGER: Criar Profile automático ao criar User no Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA (Dados Iniciais)
-- Inserir um Pipeline Padrão
insert into public.pipelines (name, description) values ('Vendas Padrão', 'Funil padrão de vendas de imóveis');

-- Inserir Etapas do Pipeline Padrão (assumindo que o ID do pipeline acima seja recuperado, mas aqui faremos num bloco DO para garantir)
do $$
declare
  p_id uuid;
begin
  select id into p_id from public.pipelines where name = 'Vendas Padrão' limit 1;
  
  insert into public.pipeline_stages (pipeline_id, name, position, color) values 
  (p_id, 'Novo Lead', 0, '#3b82f6'), -- Blue
  (p_id, 'Contato Realizado', 1, '#10b981'), -- Emerald
  (p_id, 'Visita Agendada', 2, '#f59e0b'), -- Amber
  (p_id, 'Proposta', 3, '#8b5cf6'), -- Violet
  (p_id, 'Negociação', 4, '#ec4899'), -- Pink
  (p_id, 'Fechado', 5, '#14b8a6'), -- Teal
  (p_id, 'Perdido', 6, '#64748b'); -- Slate
end $$;
