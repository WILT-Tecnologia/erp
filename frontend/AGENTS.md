# Design System

O projeto utiliza uma arquitetura híbrida de interface composta por:

- **Shadcn/UI** como Design System oficial.
- **Tailwind CSS 4** como sistema de estilização.
- **MUI X Data Grid** exclusivamente para componentes de tabela.

Esta combinação é obrigatória em todo o projeto.

## Regras

Todo componente visual da aplicação deve utilizar exclusivamente:

- Shadcn/UI
- Tailwind CSS

Exemplos:

- Button
- Input
- Select
- Checkbox
- Radio Group
- Switch
- Card
- Badge
- Dialog
- Sheet
- Drawer
- Popover
- Dropdown Menu
- Tooltip
- Tabs
- Navigation Menu
- Breadcrumb
- Calendar
- Command
- Skeleton
- Progress
- Toast
- Sidebar

---

# Tabelas

Todas as tabelas da aplicação devem utilizar **obrigatoriamente** o **MUI X Data Grid** e se possível utilizar a **Tanstack table**.

Não utilizar:

- HTML Table
- DataTables
- AG Grid
- tabelas customizadas

A Data Grid da MUI é o padrão oficial do projeto por oferecer:

- Virtualização nativa
- Alta performance
- Paginação Server-side
- Ordenação Server-side
- Filtros Server-side
- Seleção de linhas
- Agrupamentos
- Column Pinning
- Column Visibility
- Column Resize
- Exportação
- Edição inline
- Tree Data
- Row Actions
- Excelente acessibilidade

Toda nova listagem deve ser construída sobre um componente reutilizável da aplicação.

Exemplo:

components/shared/DataGrid/

Nunca instanciar diretamente o DataGrid da MUI em páginas.

Sempre criar ou reutilizar um wrapper interno da aplicação.

---

# Integração entre Shadcn e MUI

Embora o projeto utilize o MUI X Data Grid, a identidade visual deve permanecer **100% alinhada ao Design System do Shadcn/UI**.

O Data Grid deve ser customizado utilizando:

- Tailwind CSS quando possível
- Theme Provider do MUI
- CSS Variables
- Tokens de cores do projeto
- Variáveis do tema claro/escuro

O usuário nunca deve perceber visualmente que existem duas bibliotecas diferentes.

O Data Grid deve seguir exatamente:

- Tipografia
- Espaçamentos
- Border Radius
- Sombras
- Paleta de cores
- Estados de Hover
- Estados de Focus
- Estados de Seleção
- Dark Mode
- Light Mode

Toda alteração de tema deve refletir automaticamente tanto nos componentes Shadcn quanto no MUI Data Grid.

É proibido utilizar o tema padrão do Material Design.

O Theme do MUI deve consumir os mesmos tokens utilizados pelo Tailwind e pelo Shadcn para manter consistência visual em toda a aplicação.

---

# Wrapper da Data Grid

Todo Data Grid deverá ser encapsulado em um componente reutilizável.

Exemplo:

components/shared/DataGrid/

O wrapper será responsável por:

- Configuração padrão
- Tema
- Internacionalização
- Paginação
- Loading
- Empty State
- Overlay
- Toolbar
- Column Menu
- Persistência de colunas
- Persistência de filtros
- Persistência de ordenação
- Integração com Server-side
- Integração com Sonner
- Integração com o tema da aplicação

Nenhuma página deverá conhecer diretamente a implementação do MUI X Data Grid.

Todas as páginas utilizarão exclusivamente o componente compartilhado da aplicação.
