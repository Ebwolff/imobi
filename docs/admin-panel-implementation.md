# 🔒 Admin Master Panel - Implementation Plan

## Overview
Create a completely separate Admin Panel for the SaaS owner (`/admin-saas`) with its own authentication, users, and data views. No cross-access with tenant CRM.

---

## Phase 1: Database Schema

### [NEW] saas_users (Admin Users)
```sql
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
```

### [NEW] plans (SaaS Plans)
```sql
create table public.plans (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  slug text unique not null,
  valor_mensal numeric not null,
  limite_usuarios integer default 5,
  limite_leads integer default 500,
  limite_automacoes integer default 10,
  limite_integracoes integer default 3,
  ativo boolean default true,
  created_at timestamptz default now()
);
```

### [NEW] subscriptions
```sql
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references tenants(id) not null,
  plan_id uuid references plans(id) not null,
  status text check (status in ('ativa', 'cancelada', 'inadimplente', 'trial')) default 'trial',
  data_inicio date not null,
  data_fim date,
  valor numeric,
  created_at timestamptz default now()
);
```

### [NEW] audit_logs
```sql
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references tenants(id),
  saas_user_id uuid references saas_users(id),
  acao text not null,
  detalhes jsonb,
  ip text,
  created_at timestamptz default now()
);
```

---

## Phase 2: Route Structure

```
/admin-saas
  ├── /login          → Login separado (saas_users)
  ├── /               → Dashboard Master
  ├── /tenants        → Gestão de Tenants
  ├── /tenants/[id]   → Detalhes do Tenant
  ├── /plans          → Gerenciar Planos
  ├── /subscriptions  → Assinaturas Ativas
  ├── /logs           → Audit Logs
  └── /settings       → Configurações

/(dashboard)          → CRM dos Tenants (already exists)
```

---

## Phase 3: Middleware & Guards

### SaaS Admin Guard
```typescript
// Only saas_users can access /admin-saas routes
// Check: user exists in saas_users table (NOT profiles)
```

### Tenant Guard  
```typescript
// Only users with tenant_id can access /(dashboard) routes
// Check: user exists in profiles table WITH tenant_id
```

---

## Phase 4: UI Components

### Admin Dashboard
- Total tenants (ativo/suspenso)
- MRR (Monthly Recurring Revenue)
- Novos tenants este mês
- Volume global de leads
- Growth chart

### Tenant Management
- List with filters (status, plano)
- Create/Edit/Suspend tenant
- Change plan
- Reset admin password

### Plans Management
- CRUD de planos
- Definir limites

---

## Security Rules

| User Type | Has tenant_id | Access |
|-----------|---------------|--------|
| saas_users | ❌ NO | /admin-saas only |
| profiles | ✅ YES | /(dashboard) only |

---

## Files to Create

| File | Purpose |
|------|---------|
| `/admin-saas/layout.tsx` | Admin layout (separate sidebar) |
| `/admin-saas/login/page.tsx` | Admin login |
| `/admin-saas/page.tsx` | Admin dashboard |
| `/admin-saas/tenants/page.tsx` | Tenant list |
| `/admin-saas/plans/page.tsx` | Plans management |
| `/admin-saas/logs/page.tsx` | Audit logs |
| `src/lib/admin-auth.ts` | Admin authentication helpers |
| `src/middleware.ts` | Update with admin routes |
