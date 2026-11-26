-- SQL defensivo de referência; reconstruído das alterações de menor privilégio.
-- NÃO é migration automática. Não executar em produção sem revisão, backup,
-- validação de catálogo, testes e autorização. Não contém dados nem credenciais.
-- Exclusivamente para revisão técnica e futura integração por migration controlada.
BEGIN;
REVOKE MAINTAIN ON TABLE public.audit_logs, public.brand_settings, public.business_cards, public.card_scan_events, public.user_pre_registrations, public.user_profiles FROM anon RESTRICT;
REVOKE REFERENCES ON TABLE public.audit_logs, public.brand_settings, public.business_cards, public.card_scan_events, public.user_pre_registrations, public.user_profiles FROM anon RESTRICT;
REVOKE TRIGGER ON TABLE public.audit_logs, public.brand_settings, public.business_cards, public.card_scan_events, public.user_pre_registrations, public.user_profiles FROM anon RESTRICT;
REVOKE TRUNCATE ON TABLE public.audit_logs, public.brand_settings, public.business_cards, public.card_scan_events, public.user_pre_registrations, public.user_profiles FROM anon RESTRICT;
REVOKE MAINTAIN ON TABLE public.audit_logs, public.brand_settings, public.business_cards, public.card_scan_events, public.user_pre_registrations, public.user_profiles FROM authenticated RESTRICT;
REVOKE REFERENCES ON TABLE public.audit_logs, public.brand_settings, public.business_cards, public.card_scan_events, public.user_pre_registrations, public.user_profiles FROM authenticated RESTRICT;
REVOKE TRIGGER ON TABLE public.audit_logs, public.brand_settings, public.business_cards, public.card_scan_events, public.user_pre_registrations, public.user_profiles FROM authenticated RESTRICT;
REVOKE TRUNCATE ON TABLE public.audit_logs, public.brand_settings, public.business_cards, public.card_scan_events, public.user_pre_registrations, public.user_profiles FROM authenticated RESTRICT;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLES FROM anon, authenticated RESTRICT;
COMMIT;
