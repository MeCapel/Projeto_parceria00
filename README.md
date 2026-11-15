# Parceria

Aplicação web para acompanhar projetos de desenvolvimento de protótipos, suas checklists e ocorrências. O sistema inclui gestão de usuários e membros, acompanhamento por etapa e geração de relatórios DOCX.

## Tecnologias

- Frontend: React 19, TypeScript, Vite 7, React Router e Bootstrap.
- Backend: Node.js, TypeScript e Express 5.
- Serviços Firebase: Authentication e Cloud Firestore, usados pelo frontend e pela API.
- Comunicação frontend/API: Axios e cookie de sessão HTTP-only.

## Requisitos

- Node.js 20.19 ou superior (ou 22.12 ou superior).
- npm.
- Acesso ao projeto Firebase e às credenciais do Firebase Admin para rodar a API.

O frontend e a API são aplicações separadas. Para desenvolvimento local, mantenha cada uma em seu próprio terminal.

## Configuração

Não versione arquivos `.env`, chaves privadas, tokens ou credenciais de serviço.

### Frontend

Crie um `.env` na raiz deste repositório com as variáveis esperadas por `src/firebaseConfig/config.ts`:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_APP_CHECK_PROVIDER=
```

O App Check usa um token de debug apenas em desenvolvimento. Autorize o token exibido no console do navegador no Firebase Console. Para publicar, configure o provedor e o domínio de produção no App Check.

O cliente HTTP está configurado em `src/services/api.ts`. No código atual, a URL local da API é `http://localhost:3000/api/v1`; em outros ambientes, use a URL correspondente da API.

### API

Na pasta `api-login-firebase`, crie um `.env` com as credenciais do Firebase Admin:

```dotenv
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

`FIREBASE_PRIVATE_KEY` deve ser fornecida como variável secreta. Se a plataforma armazenar as quebras de linha como `\n`, a API as converte ao inicializar o Firebase Admin.

## Executar localmente

Terminal 1, API:

```bash
cd api-login-firebase
npm install
npm run dev
```

Terminal 2, frontend, na raiz deste repositório:

```bash
npm install
npm run dev
```

O Vite informa o endereço local ao iniciar, normalmente `http://localhost:5173`. A API local escuta na porta `3000`.

## Comandos

Na raiz do frontend:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite. |
| `npm run build` | Executa a checagem TypeScript e gera a versão de produção. |
| `npm run preview` | Serve localmente o build de produção. |
| `npm run lint` | Executa o ESLint. |

Na pasta `api-login-firebase`:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia a API com reinício automático. |
| `npm run build` | Compila a API TypeScript para `dist/`. |
| `npm start` | Inicia a versão compilada da API. |

Ainda não há suíte de testes automatizados. O script `npm test` do frontend é apenas uma mensagem informativa; o script da API ainda não está configurado para executar testes.

## Estrutura

```text
src/
  components/       Componentes agrupados por área funcional
  context/          Contexto de autenticação
  firebaseConfig/   Inicialização do Firebase no navegador
  hooks/            Hooks reutilizáveis
  pages/            Páginas e telas de navegação
  services/         Clientes HTTP e serviços de dados
  styles/           Estilos compartilhados
  utils/            Funções auxiliares e tipos
api-login-firebase/ Aplicação Express separada, com rotas, serviços e repositórios
```

## Equipe

- Isis Beatriz: [GitHub](https://github.com/isisbia)
- João Victor: Desenvolvimento Backend
- Maria Capelani: [GitHub](https://github.com/MeCapel)
- Vitor Afonso: [GitHub](https://github.com/VitorAfonsoDosSanto)
