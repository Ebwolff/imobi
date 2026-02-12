-- Sincronização Forçada de UUID do Master Admin
-- Este script resolve problemas onde o ID na tabela saas_users não coincide com o ID real da sessão.

DO $$
DECLARE
    v_actual_id UUID;
    v_email TEXT := 'eberscaow@gmail.com';
BEGIN
    -- 1. Tentar encontrar o ID real usando e-mail (case-insensitive para segurança extra)
    SELECT id INTO v_actual_id FROM auth.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;

    IF v_actual_id IS NOT NULL THEN
        -- 2. Limpar qualquer lixo ou IDs antigos para este e-mail na tabela de permissões
        DELETE FROM public.saas_users WHERE LOWER(email) = LOWER(v_email);
        DELETE FROM public.saas_users WHERE id = v_actual_id;

        -- 3. Inserir o registro correto com o UUID atual da sessão
        INSERT INTO public.saas_users (id, email, nome, senha_hash, role, ativo)
        VALUES (
            v_actual_id, 
            v_email, 
            'Eber Master', 
            '$2a$10$dummyhashnotusedbyauth', 
            'owner', 
            true
        );

        RAISE NOTICE 'Sincronização concluída: E-mail % vinculado ao UUID % com cargo OWNER.', v_email, v_actual_id;
    ELSE
        RAISE NOTICE 'ERRO: Usuário % não encontrado na tabela auth.users. Ele precisa criar uma conta primeiro.', v_email;
    END IF;
END $$;
