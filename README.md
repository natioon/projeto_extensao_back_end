# 🛒 API - Vitrine Virtual e Gestão de Lojas

## 📌 Sobre o Projeto
Esta é uma API RESTful desenvolvida como trabalho académico com o objetivo de auxiliar ativamente microempreendedores e comerciantes locais. A plataforma atua em duas frentes: permite que clientes acedam a catálogos de forma pública e que lojistas façam a gestão das suas lojas e produtos com total autonomia.

A arquitetura foi pensada para ser escalável, segura e flexível, fugindo do modelo engessado de grandes aplicações de mercado, permitindo a gestão de variados tipos de comércio (desde hortofrutícolas a prestação de serviços).

## 🚀 Tecnologias Utilizadas
*   **Node.js** com **Express** (Criação do servidor e rotas)
*   **PostgreSQL** (Base de dados relacional)
*   **JWT (JSON Web Tokens)** (Autenticação e segurança)
*   **Arquitetura MVC (parcial)** (Separação de Rotas, Controladores e Middlewares)

## 🛡️ Destaques Técnicos
*   **Segurança de Rotas:** Implementação de `authmiddleware` para proteger endpoints privados. O `id_comerciante` é extraído do token JWT, dispensando o envio do ID pelo corpo do pedido.
*   **Prevenção contra IDOR:** Validações de propriedade feitas diretamente no nível da base de dados através de *subqueries* e cláusulas `WHERE EXISTS`, garantindo que um comerciante só possa alterar os produtos das suas próprias lojas.
*   **Atualizações Parciais Inteligentes:** Uso da função `COALESCE` no PostgreSQL para permitir a edição de apenas alguns campos do produto sem sobrescrever ou apagar dados já existentes.
*   **Automatização no Banco:** Stored Procedures implementadas para reajustes de preços em massa.

---

## ⚙️ Como executar o projeto localmente

Para testar esta API na sua máquina, siga os passos abaixo:

### 1. Pré-requisitos
*   [Node.js](https://nodejs.org/) instalado.
*   [PostgreSQL](https://www.postgresql.org/) instalado e a correr.
*   Um software para testar as rotas (como Insomnia ou Postman).

### 2. Clonar o Repositório
Abra o seu terminal e execute:
```bash
git clone [https://github.com/natioon/projeto_extensao_back_end.git](https://github.com/natioon/projeto_extensao_back_end.git)
cd projeto_extensao_back_end
```

### 3. Instalar as Dependências
Execute o comando abaixo para instalar as bibliotecas (Express, JWT, pg, etc.):
```bash
npm install
```

### 4. Configurar a Base de Dados
1. Abra o seu gestor de base de dados PostgreSQL (ex: DBeaver ou pgAdmin).
2. Crie uma base de dados vazia (ex: `vitrine_virtual`).
3. Localize o ficheiro **`script.sql`** na raiz deste projeto.
4. Execute o conteúdo desse ficheiro na base de dados recém-criada. Este script irá criar todas as tabelas, chaves estrangeiras, restrições e irá popular o banco com dados de teste.

### 5. Configurar as Variáveis de Ambiente
Na raiz do projeto, crie um ficheiro chamado exatamente **`.env`** e preencha com as suas credenciais locais do PostgreSQL:

```env
PORT=3000
DB_USER=seu_utilizador_postgres
DB_PASSWORD=sua_senha_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vitrine_virtual
JWT_SECRET=sua_chave_secreta_jwt
```

### 6. Iniciar o Servidor
Com tudo configurado, inicie a API com o comando:
```bash
node src/server.js
```
O servidor estará a correr e pronto a receber pedidos em `http://localhost:3000`.

---

## 📍 Principais Endpoints

### Públicos
*   `GET /lojas` - Lista todas as lojas (Vitrine Pública).
*   `POST /login` - Autenticação do comerciante e geração do Token JWT.

### Privados (Requerem Token JWT no Header Authorization: Bearer <token>)
*   `GET /lojas/minhas-lojas` - Lista apenas as lojas do comerciante autenticado.
*   `POST /produtos/loja/:id_loja` - Cria um produto (valida se a loja pertence ao utilizador).
*   `PUT /produtos/:id_produto` - Atualiza dados do produto.
*   `DELETE /produtos/:id_produto` - Remove um produto do catálogo.

---
**Autor:** Antônio Carlos
**Disciplina:** Back-End / Base de Dados