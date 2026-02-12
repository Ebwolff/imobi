-- Configuração de Tenant e Perfil de Teste para o Master Admin
DO $$
DECLARE
    v_user_id UUID;
    v_tenant_id UUID;
    v_plan_id UUID;
BEGIN
    -- 1. Busca o ID do usuário Master
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'eberscaow@gmail.com';

    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Aviso: Usuário eberscaow@gmail.com não encontrado. Pulando configuração de perfil.';
    ELSE
        -- 2. Garante a existência de um Tenant de teste
        INSERT INTO public.tenants (nome_empresa, slug, email_principal, status, plano)
        VALUES ('Imobiliária Teste', 'teste', 'eberscaow@gmail.com', 'ativo', 'pro')
        ON CONFLICT (slug) DO UPDATE SET nome_empresa = EXCLUDED.nome_empresa
        RETURNING id INTO v_tenant_id;

        -- 3. Garante a existência de um Plano 'Pro' no sistema SaaS
        INSERT INTO public.plans (nome, slug, valor_mensal, limite_usuarios, limite_leads, ativo)
        VALUES ('Pro', 'pro', 197.00, 10, 5000, true)
        ON CONFLICT (slug) DO UPDATE SET valor_mensal = EXCLUDED.valor_mensal
        RETURNING id INTO v_plan_id;

        -- 4. Cria a assinatura para o Tenant
        INSERT INTO public.subscriptions (tenant_id, plan_id, status, data_inicio)
        VALUES (v_tenant_id, v_plan_id, 'ativa', CURRENT_DATE)
        ON CONFLICT DO NOTHING;

        -- 5. Atualiza o perfil do usuário para ser ADMIN no CRM deste Tenant
        -- O trigger on_auth_user_created já deve ter criado o perfil básico, vamos apenas configurar
        INSERT INTO public.profiles (id, email, tenant_id, full_name, role)
        VALUES (v_user_id, 'eberscaow@gmail.com', v_tenant_id, 'Eber Master', 'admin')
        ON CONFLICT (id) DO UPDATE SET 
            tenant_id = EXCLUDED.tenant_id,
            role = 'admin',
            full_name = EXCLUDED.full_name;

        RAISE NOTICE 'Sucesso: Tenant "teste" criado e usuário vinculado como Admin do CRM.';
    END IF;
END $$;
