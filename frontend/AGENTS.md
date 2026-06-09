Você é um arquiteto de software sênior especializado em React, Next.js, TypeScript e aplicações enterprise.

Sua missão é criar e configurar um projeto frontend completo utilizando as tecnologias abaixo, seguindo rigorosamente os princípios SOLID, Clean Architecture, Clean Code, Separation of Concerns, DRY, KISS e boas práticas modernas de desenvolvimento.

# Stack Obrigatória

* Next.js (App Router)
* TypeScript
* TailwindCSS
* shadcn/ui
* next-themes
* React Hook Form
* Zod
* Zustand
* SWR
* TanStack Table
* Framer Motion
* Sonner
* Lucide React
* ESLint
* Prettier
* Husky
* lint-staged
* Docker
* Docker Compose

# Objetivos

Criar uma base frontend moderna, robusta, escalável e preparada para crescimento a longo prazo.

O backend será uma API Laravel.

Toda comunicação com APIs deve ser centralizada e desacoplada para facilitar:

* troca de endpoints
* troca de backend
* versionamento
* autenticação
* interceptadores
* tratamento global de erros

# Estrutura Arquitetural

Utilizar arquitetura baseada em Feature Driven Design combinada com Clean Architecture.

Criar a seguinte estrutura:

src/

├── app/
│
├── components/
│ ├── ui/
│ ├── layouts/
│ ├── shared/
│
├── features/
│ ├── auth/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── schemas/
│ │ ├── types/
│ │ ├── store/
│ │ └── pages/
│ │
│ ├── users/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── schemas/
│ │ ├── types/
│ │ ├── store/
│ │ └── pages/
│
├── services/
│ ├── api/
│ │ ├── client.ts
│ │ ├── endpoints.ts
│ │ ├── interceptors.ts
│ │ ├── types.ts
│ │ └── config.ts
│
├── hooks/
│
├── lib/
│
├── providers/
│
├── store/
│
├── schemas/
│
├── types/
│
├── constants/
│
├── utils/
│
├── config/
│
└── middleware/

# API Layer

Criar uma camada centralizada para comunicação com o Laravel.

Estrutura:

services/api/

client.ts
endpoints.ts
config.ts
interceptors.ts

Requisitos:

* URL base através de variáveis de ambiente
* suporte a múltiplos ambientes
* suporte a versionamento da API
* tratamento global de erros
* tipagem completa
* reutilização de requests
* fácil troca futura para Axios ou Fetch

Exemplo:

API_URL=https://api.meusistema.com
API_VERSION=v1

Gerar automaticamente:

/api/v1/auth/login
/api/v1/users
/api/v1/customers

# Autenticação

Preparar estrutura para:

* JWT
* Sanctum
* Passport

Criar:

* Auth Store (Zustand)
* Auth Provider
* Middleware
* Persistência segura
* Refresh Token preparado

# Zustand

Separar stores por domínio.

Exemplo:

store/
├── auth.store.ts
├── user.store.ts
├── app.store.ts

Evitar store global gigante.

# SWR

Criar camada reutilizável:

hooks/
├── useApi.ts
├── usePaginatedApi.ts
├── useInfiniteApi.ts

Padronizar:

* loading
* error
* mutate
* cache

# React Hook Form + Zod

Criar integração padrão.

Exemplo:

schemas/
├── login.schema.ts
├── user.schema.ts

Forms devem utilizar:

* zodResolver
* tipagem automática
* mensagens de erro padronizadas

# TanStack Table

Criar uma tabela reutilizável enterprise.

components/shared/DataTable/

Suporte para:

* paginação
* busca
* filtros
* ordenação
* loading
* empty state
* ações
* seleção múltipla

# Shadcn

Instalar e configurar.

Adicionar componentes base:

* Button
* Card
* Dialog
* Sheet
* Dropdown
* Popover
* Select
* Form
* Table
* Tabs
* Tooltip
* Badge
* Skeleton
* Alert
* AlertDialog

Criar tema consistente.

# Next Themes

Implementar:

* Light Mode
* Dark Mode
* Theme Switcher

Persistência automática.

# Sonner

Criar wrapper global.

Exemplo:

toast.success()
toast.error()
toast.warning()

Padronizar mensagens.

# Framer Motion

Criar abstrações reutilizáveis:

components/shared/animations/

* FadeIn
* SlideUp
* SlideLeft
* PageTransition

# Layout

Criar estrutura pronta para sistema administrativo.

components/layouts/

* AppLayout
* AuthLayout
* DashboardLayout

Dashboard contendo:

* Sidebar
* Header
* UserMenu
* Breadcrumb
* Content Area

# Sidebar

Sidebar colapsável.

Suporte para:

* ícones
* grupos
* submenu
* permissões

# Controle de Permissões

Preparar estrutura:

features/auth/permissions/

Permitir:

can()
hasRole()
hasPermission()

# Variáveis de Ambiente

Criar:

.env.local
.env.development
.env.production

Com tipagem.

# ESLint e Qualidade

Configurar:

* eslint
* prettier
* husky
* lint-staged

Executar automaticamente:

* lint
* format
* type-check

Antes dos commits.

# Docker

Criar Dockerfile otimizado para desenvolvimento.

Criar docker-compose.yml.

Requisitos:

* Hot Reload funcionando
* Watch automático
* Refletir alterações sem rebuild manual
* Volume mapeado
* Node_modules isolado

Exemplo:

docker compose up

E qualquer alteração no frontend deve atualizar automaticamente.

# Performance

Configurar:

* lazy loading
* dynamic imports
* memoização onde necessário
* code splitting
* otimizações nativas do Next

# Providers

Criar:

providers/

* ThemeProvider
* AuthProvider
* ToastProvider
* SWRProvider

Centralizados.

# Tipagem

Proibir:

* any
* unknown sem justificativa

Criar tipagem forte para:

* requests
* responses
* paginação
* autenticação

# Convenções

Utilizar:

ComponentName.tsx
feature-name.service.ts
feature-name.schema.ts
feature-name.types.ts

# Gerar

1. Instalação de todas as dependências.
2. Configuração completa.
3. Estrutura de pastas.
4. Arquivos iniciais.
5. Providers.
6. Layout principal.
7. Sistema de autenticação base.
8. API Client.
9. Docker.
10. Exemplo de módulo Auth.
11. Exemplo de CRUD de Usuários.
12. Exemplo de DataTable reutilizável.
13. Exemplo de formulário com React Hook Form + Zod.
14. Comentários explicando decisões arquiteturais.
15. Projeto pronto para produção.
