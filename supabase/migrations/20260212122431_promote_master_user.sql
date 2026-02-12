-- Promover eberscaow@gmail.com a Master Admin
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- 1. Busca o ID na tabela de autenticação
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'eberscaow@gmail.com';

    IF v_user_id IS NOT NULL THEN
        -- 2. Insere ou atualiza na tabela administrativa public.saas_users
        -- Incluindo campos obrigatórios: nome, senha_hash, ativo
        INSERT INTO public.saas_users (id, email, nome, senha_hash, role, ativo)
        VALUES (
            v_user_id, 
            'eberscaow@gmail.com', 
            'Eber Master', 
            '$2a$10$dummyhashnotusedbyauth', -- Nosso app usa Supabase Auth, mas a coluna é NOT NULL
            'owner', 
            true
        )
        ON CONFLICT (id) DO UPDATE SET 
            role = 'owner',
            nome = EXCLUDED.nome,
            ativo = true;
        
        RAISE NOTICE 'Sucesso: Usuário eberscaow@gmail.com agora é OWNER do SaaS.';
    ELSE
        RAISE NOTICE 'Aviso: Usuário eberscaow@gmail.com não encontrado no Auth. Certifique-se de que ele já criou uma conta.';
    END IF;
END $$;
