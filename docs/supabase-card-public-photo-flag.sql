-- Execute uma vez no SQL Editor do Supabase.
-- A flag é privada por padrão: cada colaborador decide se publica sua foto.
alter table public.business_cards
add column if not exists show_avatar_public boolean not null default false;
