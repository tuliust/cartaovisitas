-- Supabase Storage para imagens dos cartões digitais da Invest RS.
-- Execute este arquivo no SQL Editor do Supabase com um usuário administrador.
-- O frontend deve usar apenas a anon key com usuário autenticado, nunca service role key.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-card-assets',
  'business-card-assets',
  true,
  5242880,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'image/x-icon',
    'image/vnd.microsoft.icon'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "business card assets public read" on storage.objects;
create policy "business card assets public read"
on storage.objects for select
using (bucket_id = 'business-card-assets');

drop policy if exists "business card assets investrs insert" on storage.objects;
create policy "business card assets investrs insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'business-card-assets'
  and lower(coalesce(auth.jwt() ->> 'email', '')) like '%@investrs.org.br'
);

drop policy if exists "business card assets investrs update" on storage.objects;
create policy "business card assets investrs update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'business-card-assets'
  and lower(coalesce(auth.jwt() ->> 'email', '')) like '%@investrs.org.br'
)
with check (
  bucket_id = 'business-card-assets'
  and lower(coalesce(auth.jwt() ->> 'email', '')) like '%@investrs.org.br'
);

drop policy if exists "business card assets investrs delete" on storage.objects;
create policy "business card assets investrs delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'business-card-assets'
  and lower(coalesce(auth.jwt() ->> 'email', '')) like '%@investrs.org.br'
);

-- Observação: se o e-mail não estiver disponível em auth.jwt() no seu projeto,
-- troque a condição por uma consulta a auth.users ou por uma claim customizada.
