-- Migração de Emergência: Sincronização Definitiva do Master Admin
-- Timestamp futuro para garantir aplicação: 20261231235959

DO $$
DECLARE
    target_uuid uuid := 'fc6b0c98-310e-45eb-ba78-6d3736b545ab';
BEGIN
    -- 1. Limpeza de conflitos
    DELETE FROM public.saas_users WHERE email = 'eberscaow@gmail.com';
    DELETE FROM public.saas_users WHERE id = target_uuid;

    -- 2. Inserção com o ID Real confirmado
    INSERT INTO public.saas_users (id, email, nome, role, ativo, senha_hash)
    VALUES (
        target_uuid,
        'eberscaow@gmail.com',
        'Eberçaow Master',
        'owner',
        true,
        'emergency_sync_hash'
    );

    RAISE NOTICE 'Sincronização de EMERGÊNCIA concluída para eberscaow@gmail.com';
END $$;
