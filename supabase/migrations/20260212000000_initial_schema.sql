-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 0. TENANTS (Multi-Tenant SaaS Core)
create table if not exists public.tenants (
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
do $$ begin
  create policy "tenants_select" on tenants for select using (auth.role() = 'authenticated');
exception when others then null; end $$;

-- SAAS_USERS (Admin Users - NOT tenants)
create table if not exists public.saas_users (
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
create table if not exists public.plans (
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
create table if not exists public.subscriptions (
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
create table if not exists public.audit_logs (
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

-- RLS for Admin Tables
alter table public.saas_users enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_logs enable row level security;

do $$ begin
  create policy "plans_select" on plans for select using (true);
exception when others then null; end $$;

-- CRM TABLES
create table if not exists public.profiles (
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

create table if not exists public.pipelines (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.pipeline_stages (
  id uuid default uuid_generate_v4() primary key,
  pipeline_id uuid references public.pipelines(id) on delete cascade not null,
  name text not null,
  position integer not null default 0,
  color text default '#cbd5e1',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  stage_id uuid references public.pipeline_stages(id),
  name text not null,
  email text,
  phone text,
  source text default 'manual',
  interest_type text,
  interest_value numeric,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.properties (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  titulo text not null,
  tipo text check (tipo in ('casa', 'apartamento', 'terreno', 'comercial', 'rural')) not null,
  finalidade text check (finalidade in ('venda', 'aluguel', 'ambos')) default 'venda',
  endereco text,
  bairro text,
  cidade text not null,
  estado text default 'SP',
  cep text,
  area_total numeric,
  area_construida numeric,
  quartos integer default 0,
  banheiros integer default 0,
  vagas integer default 0,
  valor numeric not null,
  valor_condominio numeric,
  valor_iptu numeric,
  descricao text,
  fotos text[],
  status text check (status in ('disponivel', 'reservado', 'vendido', 'alugado', 'inativo')) default 'disponivel',
  destaque boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for CRM
alter table public.profiles enable row level security;
alter table public.pipelines enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.leads enable row level security;
alter table public.properties enable row level security;

-- Simple CRM Policies
do $$ begin
  create policy "Public profiles are viewable by everyone" on profiles for select using ( true );
  create policy "Users can insert their own profile" on profiles for insert with check ( auth.uid() = id );
  create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );
  create policy "auth_select_pipelines" on pipelines for select using (auth.role() = 'authenticated');
  create policy "auth_select_stages" on pipeline_stages for select using (auth.role() = 'authenticated');
  create policy "auth_all_leads" on leads for all using (auth.role() = 'authenticated');
  create policy "auth_all_properties" on properties for all using (auth.role() = 'authenticated');
exception when others then null; end $$;

-- Triggers
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end; $$;

do $$ begin
  create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
exception when others then null; end $$;

-- Seeds
insert into public.pipelines (name, description) values ('Vendas Padrão', 'Funil padrão de vendas de imóveis') on conflict do nothing;
do $$
declare p_id uuid;
begin
  select id into p_id from public.pipelines where name = 'Vendas Padrão' limit 1;
  insert into public.pipeline_stages (pipeline_id, name, position, color) values 
  (p_id, 'Novo Lead', 0, '#3b82f6'),
  (p_id, 'Contato Realizado', 1, '#10b981'),
  (p_id, 'Visita Agendada', 2, '#f59e0b'),
  (p_id, 'Proposta', 3, '#8b5cf6'),
  (p_id, 'Negociação', 4, '#ec4899'),
  (p_id, 'Fechado', 5, '#14b8a6'),
  (p_id, 'Perdido', 6, '#64748b')
  on conflict do nothing;
end $$;
