# FinanceLar - Sistema de Controle Financeiro Familiar

## 🚀 Stack Tecnológica

### **Frontend**
- **Next.js 15** (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts para visualizações
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

### **Backend/Database**
- **Supabase** (PostgreSQL) com fallback para dados mock
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm
- Conta no Supabase (para produção)

## 🛠️ Configuração do Projeto

### 1. Instalação das Dependências

```bash
pnpm install
```

### 2. Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

3. Configure as variáveis de ambiente no `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

4. Execute o script SQL no Supabase SQL Editor:
   - Acesse o painel do Supabase
   - Vá para SQL Editor
   - Execute o conteúdo do arquivo `supabase-complete-setup.sql`

### 3. Executar o Projeto

```bash
pnpm dev
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
finanças-familia/
├── app/                    # App Router do Next.js 15
│   ├── categories/         # Gestão de categorias
│   ├── credit-cards/       # Gestão de cartões
│   ├── reports/           # Relatórios financeiros
│   ├── timeline/          # Timeline de transações
│   └── transactions/      # Gestão de transações
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── ...
├── lib/                  # Utilitários e configurações
│   ├── supabase/         # Cliente Supabase
│   ├── utils/            # Funções utilitárias
│   └── database.ts       # Funções de banco (com fallback mock)
└── scripts/              # Scripts SQL do banco
```

## 🎨 Componentes UI

O projeto utiliza **shadcn/ui** com Tailwind CSS para uma interface moderna e responsiva:

- Cards com gradientes e animações
- Gráficos interativos com Recharts
- Formulários com validação
- Modais e dialogs
- Navegação responsiva

## 🔧 Funcionalidades

- ✅ Dashboard com métricas financeiras
- ✅ Gestão de categorias de gastos
- ✅ Controle de cartões de crédito
- ✅ Transações recorrentes
- ✅ Relatórios e gráficos
- ✅ Timeline de movimentações
- ✅ Interface responsiva
- ✅ Modo escuro/claro

## 🚀 Deploy

O projeto está configurado para deploy na Vercel:

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 📝 Notas de Desenvolvimento

- O projeto funciona com dados mock quando o Supabase não está configurado
- Todos os componentes são client-side para compatibilidade com Recharts
- Utiliza TypeScript para type safety
- Configurado com ESLint e Prettier

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request