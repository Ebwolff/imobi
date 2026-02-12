-- Force schema cache reload by making a dummy change
ALTER TABLE public.saas_users ADD COLUMN IF NOT EXISTS _dummy_reload boolean DEFAULT false;
ALTER TABLE public.saas_users DROP COLUMN IF EXISTS _dummy_reload;

-- Also re-sync the owner role for good measure
INSERT INTO public.saas_users (id, email, nome, senha_hash, role)
VALUES ('fc6b0c98-310e-45eb-ba78-6d3736b545ab', 'eberscaow@gmail.com', 'System Owner', 'forced_sync', 'owner')
ON CONFLICT (id) DO UPDATE SET role = 'owner';
