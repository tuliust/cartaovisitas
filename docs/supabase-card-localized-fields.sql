-- Execute no SQL Editor do Supabase antes de publicar o formulário multilíngue.
-- Os campos PT/ES/EN armazenam cargo e departamento em cada idioma.
-- job_title e department permanecem como fallback PT para a página pública e o vCard.
alter table public.business_cards
  add column if not exists job_title_pt text,
  add column if not exists job_title_es text,
  add column if not exists job_title_en text,
  add column if not exists department_pt text,
  add column if not exists department_es text,
  add column if not exists department_en text;

-- Migração opcional dos dados legados para PT, sem sobrescrever traduções existentes.
update public.business_cards
set job_title_pt = coalesce(job_title_pt, job_title),
    department_pt = coalesce(department_pt, department)
where job_title_pt is null or department_pt is null;
