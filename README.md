# TrackRep Frontend

Frontend do sistema TrackRep, desenvolvido em React com Vite.

## Descrição

O TrackRep é um sistema web para registro e acompanhamento de treinos de musculação.

Esta aplicação permite que o usuário cadastre sua conta, faça login, registre sessões de treino, acompanhe estatísticas, visualize histórico de treinos, atualize medidas corporais e consulte exercícios por meio de uma API externa.

---

## Tecnologias Utilizadas

- React
- Vite
- JavaScript
- Axios
- React Router DOM
- React Icons
- CSS
- LocalStorage
- Integração com API Node.js/Express

---

## Funcionalidades

### Usuário

- Cadastro de conta
- Login
- Logout
- Proteção de rotas
- Alteração de senha
- Exclusão de conta
- Página de perfil
- Salvamento de altura, peso e medidas corporais

### Treinos

- Criação de sessão de treino
- Escolha da data do treino
- Cadastro de múltiplos exercícios
- Cadastro de múltiplas séries por exercício
- Registro de carga e repetições
- Cronômetro de treino
- Cálculo de volume total
- Histórico de treinos
- Exclusão de treinos

### Dashboard

- Treinos realizados na semana
- Tempo total estimado
- Volume total levantado
- Sequência de treinos
- Gráfico de progressão de carga
- Lista de treinos recentes

### Estatísticas e API externa

- Busca de exercícios
- Filtros de exercícios
- Visualização de detalhes
- Integração com API externa Wger

---

## Estrutura do Projeto

```text
trackrep-frontend
│
├── public
│   ├── favicon.svg
│   ├── icons.svg
│   └── trackrepimg.jpg
│
├── src
│   ├── assets
│   ├── App.css
│   ├── App.jsx
│   ├── Home.jsx
│   ├── HomeDashboard.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Perfil.jsx
│   ├── Stats.jsx
│   ├── Terms.jsx
│   ├── Treinos.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## Páginas do Sistema

### `/`

Página inicial pública do sistema.

### `/login`

Tela de login do usuário.

### `/register`

Tela de cadastro de usuário.

### `/home`

Dashboard principal do usuário autenticado.

### `/treinos`

Tela de gerenciamento e criação de treinos.

### `/estatisticas`

Tela de consulta de exercícios por API externa.

### `/perfil`

Tela de dados da conta, alteração de senha e medidas corporais.

### `/termos`

Página de Termos de Uso.

---

## Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Entrar na pasta do projeto

```bash
cd trackrep-frontend
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o frontend

```bash
npm run dev
```

### 5. Acessar no navegador

```bash
http://localhost:5173
```

---

## Configuração da API

O frontend se comunica com o backend local pela URL:

```bash
http://localhost:3000
```

Por isso, antes de usar o sistema, o backend do TrackRep precisa estar rodando.

---

## Fluxo de Uso

1. Acessar a tela inicial.
2. Criar uma conta.
3. Fazer login.
4. Acessar o dashboard.
5. Cadastrar medidas no perfil.
6. Criar uma sessão de treino.
7. Adicionar exercícios.
8. Adicionar séries, cargas e repetições.
9. Salvar o treino.
10. Visualizar o histórico e o gráfico de progressão.
11. Consultar exercícios na tela de estatísticas.
12. Alterar senha ou excluir conta, se necessário.

---

## Scripts Disponíveis

### Iniciar ambiente de desenvolvimento

```bash
npm run dev
```

### Gerar versão de produção

```bash
npm run build
```

### Visualizar build local

```bash
npm run preview
```

---

## Segurança

- Rotas protegidas com verificação de token JWT.
- Token armazenado no LocalStorage.
- Usuário não autenticado é redirecionado para a tela de login.
- Requisições protegidas enviam token no cabeçalho Authorization.

---

## Integração com Backend

Principais rotas consumidas pelo frontend:

| Método | Rota | Descrição |
|---|---|---|
| POST | `/register` | Cadastro de usuário |
| POST | `/login` | Login |
| GET | `/perfil` | Buscar perfil |
| PUT | `/perfil` | Atualizar perfil |
| PUT | `/usuarios/alterar-senha` | Alterar senha |
| DELETE | `/usuarios/minha-conta` | Excluir conta |
| GET | `/treinos/sessoes` | Listar treinos |
| POST | `/treinos/sessao` | Salvar treino |
| DELETE | `/treinos/sessoes/:id` | Excluir treino |
| GET | `/api/exercicios` | Buscar exercícios externos |

---

## Autor

Fernando Faria Hong

## Orientador

Alessandro Aparecido da Silva Horas

## Projeto Acadêmico

Trabalho de Conclusão de Curso  
Curso: Sistemas de Informação  
Universidade de Mogi das Cruzes - UMC
