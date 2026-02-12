-- 1. Vincular o e-mail ao UUID REAL detectado no Debug
-- UUID detectado: fc6b0c98-310e-45eb-ba78-6d3736b545ab
-- E-mail: eberscaow@gmail.com

DO $$
DECLARE
    target_uuid uuid := 'fc6b0c98-310e-45eb-ba78-6d3736b545ab';
BEGIN
    -- Limpa entradas antigas ou duplicadas para este e-mail
    DELETE FROM public.saas_users WHERE email = 'eberscaow@gmail.com';
    DELETE FROM public.saas_users WHERE id = target_uuid;

    -- Insere o usuário com o UUID exato da sessão
    INSERT INTO public.saas_users (id, email, nome, role, ativo, senha_hash)
    VALUES (
        target_uuid,
        'eberscaow@gmail.com',
        'Eberscaow Master',
        'owner',
        true,
        'forced_sync_no_hash' -- Login via Supabase Auth, senha_hash não usada mas é obrigatória no schema
    );

    RAISE NOTICE 'Sincronização concluída: E-mail eberscaow@gmail.com vinculado ao UUID fc6b0c98-310e-45eb-ba78-6d3736b545ab com cargo OWNER.';
END $$;

-- 2. Garantir RLS para leitura do próprio perfil SaaS
DROP POLICY IF EXISTS "Users can view own saas record" ON public.saas_users;
CREATE POLICY "Users can view own saas record" ON public.saas_users
FOR SELECT USING (auth.uid() = id);
