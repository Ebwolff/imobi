# Plano de Implementação: SaaS CRM Imobiliário

## 🎯 Objetivo
Desenvolver um CRM SaaS moderno e responsivo focado no mercado imobiliário, com gestão de leads, funil de vendas (Kanban) e automações sociais.

## ❓ Questões para Definição (Aguardando Resposta)
> [!IMPORTANT]
> Preciso da sua confirmação sobre os pontos abaixo para iniciarmos com a arquitetura correta:

1.  **Integração WhatsApp/Instagram**: Decisão adiada (Foco inicial no Core CRM).
2.  **Escopo do MVP**: **Foco no Core CRM** (Cadastro Manual + Kanban) confirmado. Automações ficam para a Fase 2.

## 🛠️ Stack Tecnológico Proposto (Padrão Premium)
-   **Frontend**: Next.js 14+ (App Router), React, TypeScript.
-   **Estilização**: Tailwind CSS + Shadcn/UI (Design moderno e acessível).
-   **Backend/DB**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions).
-   **State Management**: Zustand ou React Query.
-   **Forms**: React Hook Form + Zod.
-   **Icons**: Lucide React.

## 🏗️ Arquitetura Proposta

### 1. Estrutura de Banco de Dados (Supabase)
-   `users` (managed by Supabase Auth)
-   `profiles`: Dados estendidos (role: 'gestor' | 'corretor', telefone, foto).
-   `leads`: Dados do lead (nome, contato, origem, status, valor_interesse).
-   `pipelines`: Definição das etapas do funil (configurável).
-   `interactions`: Histórico de mensagens/atividades.
-   `properties`: (Futuro) Cadastro de imóveis para vínculo.

### 2. Automação e Webhooks
-   Utiliarlizaremos **Supabase Edge Functions** para receber webhooks do Instagram/WhatsApp e criar/atualizar leads automaticamente no banco.

## 📅 Plano de Execução Imediata

### Fase 1: Fundação
1.  Setup do projeto Next.js com presets do Shadcn.
2.  Configuração das variáveis de ambiente e conexão com Supabase.
3.  Criação do Layout Base (Sidebar, Header, Theme Toggle).

### Fase 2: Autenticação e Dashboard
1.  Telas de Login/Recuperação de Senha.
2.  Proteção de rotas (Middleware).
3.  Dashboard inicial (Skeleton).
