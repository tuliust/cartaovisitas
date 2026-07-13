-- Conteúdo institucional administrável. Migration aditiva e idempotente.
create extension if not exists "pgcrypto";

create table if not exists public.managed_pages (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique check (page_key ~ '^[a-z][a-z0-9_]*$'),
  route_path text not null unique check (route_path ~ '^/'),
  title text not null check (length(btrim(title)) > 0),
  subtitle text,
  content jsonb not null check (jsonb_typeof(content) = 'object' and content ? 'sections' and jsonb_typeof(content -> 'sections') = 'array'),
  visibility text not null check (visibility in ('public', 'authenticated')),
  is_published boolean not null default true,
  version_label text,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists managed_pages_publication_idx on public.managed_pages (visibility, is_published);
create index if not exists managed_pages_updated_at_idx on public.managed_pages (updated_at desc);

create or replace function public.set_managed_page_updated_at() returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); if auth.uid() is not null then new.updated_by = auth.uid(); end if; return new; end $$;
drop trigger if exists set_managed_page_updated_at on public.managed_pages;
create trigger set_managed_page_updated_at before update on public.managed_pages for each row execute function public.set_managed_page_updated_at();

alter table public.managed_pages enable row level security;
drop policy if exists "managed pages public published read" on public.managed_pages;
create policy "managed pages public published read" on public.managed_pages for select to anon, authenticated using (is_published and visibility = 'public');
drop policy if exists "managed pages authenticated published read" on public.managed_pages;
create policy "managed pages authenticated published read" on public.managed_pages for select to authenticated using (is_published and visibility = 'authenticated');
drop policy if exists "managed pages admin read all" on public.managed_pages;
create policy "managed pages admin read all" on public.managed_pages for select to authenticated using (public.is_admin());
drop policy if exists "managed pages admin insert" on public.managed_pages;
create policy "managed pages admin insert" on public.managed_pages for insert to authenticated with check (public.is_admin() and updated_by = auth.uid());
drop policy if exists "managed pages admin update" on public.managed_pages;
create policy "managed pages admin update" on public.managed_pages for update to authenticated using (public.is_admin()) with check (public.is_admin() and updated_by = auth.uid());
drop policy if exists "managed pages admin delete" on public.managed_pages;
create policy "managed pages admin delete" on public.managed_pages for delete to authenticated using (public.is_admin());

revoke all on table public.managed_pages from public, anon, authenticated;
grant select on table public.managed_pages to anon;
grant select, insert, update, delete on table public.managed_pages to authenticated;

insert into public.managed_pages (page_key, route_path, title, subtitle, content, visibility, is_published, version_label)
values
('terms_and_privacy','/termos-de-uso-e-privacidade','Termos de Uso e Privacidade','Minuta informativa da plataforma de cartões digitais.',jsonb_build_object('notice',jsonb_build_object('title','Minuta em revisão','body','Este documento é uma versão inicial e não deve ser interpretado como parecer jurídico definitivo. Conteúdo sujeito à validação institucional e jurídica.'),'sections',jsonb_build_array(
jsonb_build_object('id','termos-de-uso','title','Termos de Uso','body','A plataforma oferece recursos para criação, manutenção e compartilhamento de cartões profissionais institucionais. O acesso à área do colaborador é pessoal e depende de credenciais válidas.'),
jsonb_build_object('id','controlador','title','Controlador','body','A identificação formal do controlador e de seus representantes será confirmada na revisão institucional. Conteúdo sujeito à validação institucional e jurídica.'),
jsonb_build_object('id','dados-coletados','title','Dados coletados','body','Podem ser tratados dados profissionais informados no cartão, identificadores de conta, imagem de perfil e eventos técnicos de interação, como visualizações, vCards, compartilhamentos e QR Code.'),
jsonb_build_object('id','finalidades','title','Finalidades','body','Os dados são utilizados para autenticar usuários, apresentar o cartão profissional, gerar arquivos solicitados, operar recursos da plataforma, proteger o acesso e produzir estatísticas para o proprietário.'),
jsonb_build_object('id','bases-legais','title','Bases legais','body','As bases legais aplicáveis a cada operação serão definidas e documentadas após análise jurídica e institucional. Conteúdo sujeito à validação institucional e jurídica.'),
jsonb_build_object('id','compartilhamento','title','Compartilhamento','body','Dados do cartão podem integrar arquivos vCard, QR Code e Wallet quando o usuário aciona essas funcionalidades. Fornecedores de infraestrutura podem processar dados estritamente para operar o serviço.'),
jsonb_build_object('id','armazenamento-e-retencao','title','Armazenamento e retenção','body','Os critérios e prazos de retenção ainda serão formalizados considerando finalidade, obrigações aplicáveis e segurança.'),
jsonb_build_object('id','cookies-e-localstorage','title','Cookies e localStorage','body','A aplicação utiliza armazenamento local para preferências públicas de identidade visual e cache de branding.'),
jsonb_build_object('id','seguranca','title','Segurança','body','São aplicadas medidas técnicas como autenticação, controle de acesso, políticas de banco e separação entre credenciais públicas e server-side.'),
jsonb_build_object('id','direitos-do-titular','title','Direitos do titular','body','Os procedimentos e o canal responsável serão publicados após validação institucional e jurídica.'),
jsonb_build_object('id','responsabilidades-do-usuario','title','Responsabilidades do usuário','body','O usuário deve proteger suas credenciais, manter informações profissionais corretas e comunicar suspeitas de uso indevido.'),
jsonb_build_object('id','disponibilidade-do-servico','title','Disponibilidade do serviço','body','A plataforma pode passar por manutenção, evolução ou indisponibilidade técnica.'),
jsonb_build_object('id','canal-de-contato','title','Canal de contato','body','O canal oficial para privacidade e suporte será inserido após confirmação institucional.'))),'public',true,'Versão preliminar 0.1 — 12 de julho de 2026. Pendente de aprovação institucional e jurídica.'),
('usage_guide','/meu-cartao/guia','Guia de Utilização','Aprenda a configurar, divulgar e acompanhar seu cartão digital.',jsonb_build_object('sections',jsonb_build_array(
jsonb_build_object('id','visao-geral','title','Visão geral da plataforma','body','A plataforma reúne seus dados profissionais, arquivo vCard, QR Code, assinatura de e-mail e métricas em uma área autenticada.'),
jsonb_build_object('id','primeiro-cartao','title','Criar o primeiro cartão','body','Acesse Editar, revise os dados institucionais, preencha os campos pessoais e salve.'),
jsonb_build_object('id','slug','title','Preencher e validar o slug','body','Use uma forma curta do nome, sem espaços ou acentos, e aguarde a confirmação de disponibilidade.'),
jsonb_build_object('id','editar','title','Editar dados','body','Atualize nome de exibição, cargo, departamento, telefones e links na página Editar.'),
jsonb_build_object('id','foto','title','Adicionar foto','body','Selecione uma imagem, ajuste o recorte e defina sua visibilidade pública.'),
jsonb_build_object('id','visual','title','Escolher visual','body','Escolha uma das seis variantes no seletor visual.'),
jsonb_build_object('id','minha-pagina','title','Abrir Minha Página','body','Use o item Minha Página para abrir seu cartão.'),
jsonb_build_object('id','compartilhar','title','Compartilhar vCard','body','Use Compartilhar meu cartão para abrir o compartilhamento nativo ou baixar o vCard.'),
jsonb_build_object('id','copiar','title','Copiar vCard','body','Abra Mais e selecione Copiar vCard.'),
jsonb_build_object('id','qr','title','Baixar e utilizar o QR Code','body','Abra Mais e selecione Baixar QR-Code.'),
jsonb_build_object('id','wallet','title','Wallet','body','Adicionar à Wallet usa a integração disponível para o dispositivo.'),
jsonb_build_object('id','gmail','title','Gerar assinatura para Gmail','body','Acesse Gerar Rodapé para E-mail e copie a assinatura.'),
jsonb_build_object('id','estatisticas','title','Consultar estatísticas','body','Acompanhe visualizações e interações por período.'),
jsonb_build_object('id','faq','title','Dúvidas frequentes','body','Salve o formulário antes de atualizar a página. O QR continua apontando para o mesmo slug.'))),'authenticated',true,null)
on conflict (page_key) do nothing;
