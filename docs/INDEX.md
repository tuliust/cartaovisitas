# Índice da documentação canônica

Esta pasta concentra a documentação oficial do sistema de cartões digitais da Invest RS.

## Documentos

1. [Visão geral](01-visao-geral.md)
2. [Arquitetura técnica](02-arquitetura-tecnica.md)
3. [Ambientes, variáveis e deploy](03-ambientes-variaveis-deploy.md)
4. [Banco, RLS e Storage](04-banco-supabase-rls-storage.md)
5. [Rotas, fluxos e perfis](05-rotas-fluxos-e-perfis.md)
6. [Cartão, vCard, QR, assinatura e Wallet](06-cartao-vcard-qr-assinatura-wallet.md)
7. [Admin: cartões, usuários, auditoria e configurações](07-admin-cartoes-usuarios-auditoria.md)
8. [Importação CSV](08-importacao-csv.md)
9. [Identidade visual, design e layout](09-identidade-visual-design-layout.md)
10. [Responsividade, acessibilidade e toasts](10-responsividade-acessibilidade-e-toasts.md)
11. [Segurança, governança e operação](11-seguranca-governanca-e-operacao.md)
12. [QA e checklists](12-qa-checklists.md)
13. [Roadmap, decisões e backlog](13-roadmap-decisoes-e-backlog.md)
14. [PWA, instalação e compartilhamento](14-pwa-instalacao-e-compartilhamento.md)
15. [E-mails transacionais e Resend](15-emails-transacionais-resend.md)
16. [Apêndice: scripts SQL](appendix-sql-scripts.md)
17. [Configuração de Wallet](wallet-setup.md)

## Fonte de verdade por assunto

| Assunto | Documento |
|---|---|
| Produto, perfis e escopo | `01` |
| Arquitetura, providers e funções | `02` |
| Ambientes, variáveis, redirects e deploy | `03` |
| Banco, RLS e Storage | `04` |
| Rotas e fluxos | `05` |
| Cartão, vCard, QR, assinatura e Wallet | `06` |
| Administração | `07` |
| Importação | `08` |
| Branding e variantes | `09` |
| Mobile, acessibilidade, modais e toasts | `10` |
| Segurança e operação | `11` |
| Testes | `12` |
| Futuro, standby e descartados | `13` |
| PWA e compartilhamento | `14` |
| E-mails e Resend | `15` |
| Execução e rastreabilidade SQL | `appendix` |
| Certificados e ativação Wallet | `wallet-setup` |

## Política documental

- O código implementado e as migrations aplicadas prevalecem sobre descrições antigas.
- Documentos de roadmap não autorizam implementação automática.
- Scripts SQL executados permanecem no repositório para rastreabilidade.
- `docs/archive/` é histórico e não constitui documentação normativa.
- Evitar duplicar explicações completas: documentos secundários devem apontar para a fonte de verdade.
