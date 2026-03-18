# Todo Frontend

Interface web para gerenciamento de tarefas (Todo List) desenvolvida com **Next.js** e **React**.
A aplicação consome uma API backend responsável pelo armazenamento e manipulação das tarefas.

## Tecnologias Utilizadas

* **Next.js**
* **React**
* **TypeScript**
* **Fetch API**
* **CSS / Tailwind classes**

## Funcionalidades

A aplicação permite gerenciar tarefas através de operações básicas de CRUD.

### Criar tarefa

Permite adicionar uma nova tarefa informando:

* Nome
* Descrição

### Listar tarefas

Exibe todas as tarefas cadastradas retornadas pela API.

Cada tarefa mostra:

* Nome
* Descrição
* Status (Pendente ou Concluído)

### Atualizar tarefa

Uma tarefa pode ser editada através do botão de edição, permitindo alterar:

* Nome
* Descrição
* Status da tarefa

### Alterar status rapidamente

O status da tarefa pode ser alternado diretamente clicando no indicador:

* **Pendente**
* **Concluído**

### Deletar tarefa

Uma tarefa pode ser removida através do botão de exclusão.

## Estrutura de Dados

Cada tarefa possui o seguinte formato:

```ts
type Todo = {
  _id: string;
  name: string;
  description: string;
  completed: boolean;
}
```

## Comunicação com a API

A aplicação se comunica com uma API REST rodando localmente.

Endpoint base:

```
http://localhost:3005
```

### Rotas utilizadas

| Método | Endpoint           | Descrição              |
| ------ | ------------------ | ---------------------- |
| GET    | `/todo/all`        | Lista todas as tarefas |
| POST   | `/todo/create`     | Cria uma nova tarefa   |
| PUT    | `/todo/update/:id` | Atualiza uma tarefa    |
| DELETE | `/todo/delete/:id` | Remove uma tarefa      |

## Instalação

Clone o repositório:

```
git clone <repo>
```

Entre na pasta do projeto:

```
cd todo-frontend
```

Instale as dependências:

```
npm install
```

ou

```
yarn
```

## Executar o projeto

Inicie o servidor de desenvolvimento:

```
npm run dev
```

ou

```
yarn dev
```

A aplicação ficará disponível em:

```
http://localhost:3001
```

## Requisitos

Para que o frontend funcione corretamente, o backend da API deve estar em execução em:

```
http://localhost:3005
```

Certifique-se também de que **CORS esteja habilitado no backend**.

## Interface

A interface possui três áreas principais:

* **Painel esquerdo:** formulário para criação de tarefas
* **Painel direito:** formulário de edição de tarefas
* **Centro:** lista de tarefas existentes

## Comportamento da Aplicação

* As tarefas são carregadas automaticamente ao abrir a página.
* Após qualquer ação (criar, editar, deletar ou alterar status), a lista é atualizada consultando novamente a API.
* A edição abre um formulário lateral que permite modificar os dados da tarefa selecionada.

## Melhorias Futuras

Possíveis evoluções do projeto:

* Autenticação de usuários
* Paginação de tarefas
* Filtros (pendentes / concluídas)
* Busca por tarefas
* Interface responsiva
* Testes automatizados

## Licença

Este projeto é apenas para fins educacionais.
# To-do-Front-End
