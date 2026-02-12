# CRM Imobiliário SaaS - Task Tracker

## ✅ Fase 1-4: Core CRM (Completo)
- [x] Setup inicial (Next.js, Supabase, Auth)
- [x] Dashboard + Sidebar
- [x] Leads Board (Kanban)
- [x] Properties, Clients, Deals CRUD
- [x] Visits (Agenda) + Tasks (Follow-up)
- [x] Webhooks para leads

## ✅ Fase 5: Multi-Tenant Core
- [x] Criar tabela `tenants`
- [x] Adicionar `tenant_id` em todas tabelas
- [x] Helper `tenant.ts` com getCurrentTenantId()

---

## 🔄 Fase 6: Admin Master Panel (SaaS Owner)

### 6.1 Database
- [x] Criar tabela `saas_users` (owner, admin_saas, suporte)
- [x] Criar tabela `plans` (planos SaaS)
- [x] Criar tabela `subscriptions` (assinaturas)
- [x] Criar tabela `audit_logs` (auditoria)

### 6.2 Authentication
- [ ] Login separado para admin (/admin-saas/login)
- [ ] Helpers de autenticação admin
- [ ] Middleware para rotas admin

### 6.3 Admin Dashboard
- [x] Layout separado /admin-saas
- [x] Dashboard com métricas globais
- [x] Gestão de Tenants (CRUD)
- [x] Gestão de Planos
- [x] Visualização de Logs

### 6.4 Security
- [ ] Guard: admin NÃO acessa CRM
- [ ] Guard: tenant NÃO acessa admin
- [ ] RLS policies para saas_users

---

## ⏳ Fase 7: RBAC (CRM)
- [ ] Admin vê tudo do tenant
- [ ] Gestor vê equipe
- [ ] Corretor vê apenas seus registros

## ⏳ Fase 8: Automations Engine
- [ ] Motor de automações
- [ ] Triggers por canal
