# Next.js App com Tailwind, Vitest, React Query e shadcn/ui

Esta é uma aplicação Next.js completa configurada com as melhores práticas e ferramentas modernas.

## 🚀 Tecnologias

- **Next.js 15** - Framework React para produção
- **Tailwind CSS** - Framework CSS utilitário
- **Vitest** - Framework de testes rápido
- **React Query** - Gerenciamento de estado para dados do servidor
- **shadcn/ui** - Componentes UI reutilizáveis
- **TypeScript** - Tipagem estática

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:

\`\`\`bash
npm install
# ou
pnpm install
# ou
yarn install
\`\`\`

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run test` - Executa os testes
- `npm run test:ui` - Executa os testes com interface visual
- `npm run test:coverage` - Executa os testes com relatório de cobertura

## 🧪 Testes

Os testes estão configurados com Vitest e Testing Library. Execute:

\`\`\`bash
npm run test
\`\`\`

Para ver a interface visual dos testes:

\`\`\`bash
npm run test:ui
\`\`\`

## 🎨 Componentes

A aplicação usa shadcn/ui para componentes. Para adicionar novos componentes:

\`\`\`bash
npx shadcn@latest add [component-name]
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
├── app/                 # App Router do Next.js
├── src/
│   ├── components/      # Componentes React
│   ├── lib/            # Utilitários
│   ├── providers/      # Providers (React Query, Theme)
│   └── test/           # Configuração de testes
├── public/             # Arquivos estáticos
└── ...
\`\`\`

## 🌙 Modo Escuro

A aplicação suporta modo escuro usando next-themes. Use o botão no canto superior direito para alternar.

## 📡 React Query

O React Query está configurado para gerenciar dados do servidor. Veja o exemplo em `UserList` component.

## 🚀 Deploy

Esta aplicação está pronta para deploy no Vercel:

1. Faça push para o GitHub
2. Conecte seu repositório no Vercel
3. Deploy automático!
