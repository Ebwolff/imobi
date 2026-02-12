-- Corrigir RLS para saas_users para permitir que a função checkSaaSAdmin funcione
-- Sem essa política, o Supabase retorna vazio para usuários autenticados, resultando em redirecionamento para o CRM.

CREATE POLICY "Users can view their own saas_user record"
ON public.saas_users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Garantir que audit_logs também possa ser inserido por administradores logados
CREATE POLICY "Admins can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM public.saas_users
    WHERE id = auth.uid() AND role IN ('owner', 'admin_saas')
));
