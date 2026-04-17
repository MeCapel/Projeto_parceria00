<!-- <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=8c1a17&height=120&section=header"/> -->

# 📌 Parceria

![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![Express](https://img.shields.io/badge/express-4.x-blue)
![Database](https://img.shields.io/badge/database-Firebase-orange)
<!-- ![JWT](https://img.shields.io/badge/auth-JWT-black) -->

## 📑 Sumário

- [Objetivo](#objetivo)
- [Tecnologias](#tecnologias)
- [Como rodar](#como-rodar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Desenvolvedores](#desenvolvedores)

## Objetivo

Desenvolver uma aplicação integrada web para apoiar a gestão do processo de desenvolvimento de novos protótipos, desde a etapa de fabricação da máquina até a validação de campo. A solução deverá **sistematizar o fluxo de trabalho**, permitindo o registro, acompanhamento e análise de ocorrências, listas de requisitos, melhorias e correções, com rastreabilidade por etapa e criticidade. Ao final do processo gerar laudo do histórico do protótipo, descrevendo todas as suas etapas, equipe responsável e possíveis correções.

## Tecnologias

- **TypesScript e JavaScript**
- **Firebase Firestore**
- **Firebase Auth**
- **Ambiente de desenvolvimento**: VSCode
- **Libraries**:
  - `react` — interface e componentes
  - `react-router` — definição e controle de rotas
  - `react-bootstrap` — estilização de componentes
  - `react-toastify` — lib de notificações
  - `axios` — cliente HTTP para node


## Como rodar

```bash
# Clone o repositório
git clone https://github.com/MeCapel/Projeto_parceria00.git

# Navegue até a pasta do projeto
cd Projeto_paceria00/

# Instale as dependências
npm install

# Insira as chaves no .env

# Rode / execute o projeto
npm run dev
```

## Estrutura do projeto 
> Organização de pastas e arquivos

```
Projeto_paceria00/
├── .github/workflows              # Automatização de processos
│  └── main.yml                  # Define comandos da pipeline para o vercel
├── public/                        # Logotipos da marca
│  └── fromBrand/ 
├── src/
│  └── components/
│    └── Chat/                    # Componentes relacionados ao chat
│    └── Checklist/               # Componentes relacionados aos modelos e instâncias das checklists
│    └── Client/                  # Componentes relacionados aos clientes
│    └── forms/                   # Componentes inputs padrões (ex: FormInput.tsx, FormRadioGroup.tsx...)
│    └── Geral/                   # Componentes compartilhados 
│    └── Login/                   # Componentes relacionados a sessão dos usuários
│    └── Ocurrence/               # Componentes relacionados as ocorrências
│    └── Othes/                   # Componentes padronizados
│    └── Project/                 # Componentes relacionados aos projetos
│    └── Members/                 # Componentes relacionados aos membros dos projetos 
│  └── context/                   # Componentes relacionados a autenticação
│  └── firebaseConfig/            # Configuração de conexão com o banco de dados Firebase Firestore 
│  └── hooks/                     # Hooks customizados
│  └── pages/                     # Páginas inteiras
│  └── services/                  # Funções Firestore 
│  └── styles/                    # Estilos
│  └── App.tsx                    # Página principal (SPA aka Single Page Application)
│  └── main.tsx                   # Importações gerais
├── .gitignore                     # Git ignora pastas ou arquivos descritos
├── README.md/                     # Apresentação e descrição do projeto
├── eslint.config.js               # Configuração eslint e seus padrões
├── index.html                     # Página base em html
├── package-lock.json              # Decrição da árvore de dependências 
├── package.json                   # Configuração de metadados e dependências do projeto
├── tsconfig.app.json              # Definir configurações do código
├── tsconfig.json                  # Definir configurações do projeto (typescript)
├── tsconfig.node.json             # Definir configurações do compilador
└── vite.config.ts                 # Definir configurações do Vite
```

## Desenvolvedores

**Isis Beatriz**  - https://github.com/isisbia
> Q&A, designer e desenvolvedora full stack

**João Victor**  - https://github.com/
> Desenvolvedor backend

**Maria Capelani**  - https://github.com/MeCapel
> Líder e desenvolvedora full stack

**Vitor Afonso**  - https://github.com/VitorAfonsoDosSanto
> Designer e desesnvolvedor front end
