
<div align="center">
  <img width="20%" src="https://site.signoweb.com.br/assets/images/logo-signo.svg" />
</div>

# Sobre nós
`Software-house especialista em desenvolvimento de projetos personalizados WEB ou MOBILE utilizando sempre tecnologias mais atuais de mercado ou consforme necessidade de nosso cliente`

## Nosso Manifesto
<img src="https://site.signoweb.com.br/assets/images/manifesto.png" />

## Nos conheça mais
<p>Site: https://www.signoweb.com.br</p>
<p>Linkedin: https://www.linkedin.com/company/2894389</p>
<p>Instagram: https://www.instagram.com/signoweb</p>
<p>Facebook: https://facebook.com/signoweb</p>

# Sobre a vaga
`Buscamos profissionais que sejam movidos a desafios e apaixonados por desenvolvimento, inovação e novas tecnologias.`

## Requisitos

### Obrigatórios:
* Mínimo 1 ano de experiência em desenvolvimento de sites e sistemas em Laravel;
* Conhecimentos em Node.JS;
* Desenvolvimento de APIs RESTful;
* Conhecimentos em SQL e NoSQL;
* Conhecimentos em Docker;
* Controle de versões (GIT).

### Diferenciais
* TDD;
* Experiência em metodologias ágeis (Scrum/Kanban).

### Como se candidatar

* <a href="teste1.md">Teste 1</a>
* <a href="teste2.md">Teste 2</a>

<div align="center">
  <img width="20%" src="https://site.signoweb.com.br/assets/images/logo-signo.svg" />
</div>

# Teste Técnico - Signo Web
> Este repositório contém o desenvolvimento do teste técnico para a vaga de desenvolvedor, focado em **Node.js, NestJS e Docker**.

<p align="center">
  <img alt="CI Status" src="https://github.com/alvarobraz/vaga-desenvolvedor-alvaro-braz/actions/workflows/ci.yml/badge.svg">
  
  <a href="https://www.linkedin.com/in/alvarobraz/">
    <img alt="Made by alvarobraz" src="https://img.shields.io/badge/made%20by-alvarobraz-%237519C1">
  </a>

  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/alvarobraz/vaga-desenvolvedor-alvaro-braz">
  <img alt="License" src="https://img.shields.io/github/license/alvarobraz/vaga-desenvolvedor-alvaro-braz">
</p>

---

<p align="center">
  <a href="#dart-sobre">Sobre</a> &#xa0; | &#xa0; 
  <a href="#rocket-tecnologias">Tecnologias</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requisitos-atendidos">Requisitos</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-como-rodar-o-projeto">Como rodar</a>
</p>

<br>

## :dart: Sobre ##

Desenvolvimento de uma API robusta utilizando **NestJS** com arquitetura baseada em **DDD (Domain-Driven Design)** e **Clean Architecture**. O projeto foi estruturado em um monorepo gerenciado por **pnpm**, garantindo escalabilidade e isolamento de domínios.

## :rocket: Tecnologias ##

As seguintes tecnologias foram utilizadas no projeto:

- [Node.js](https://nodejs.org/) (v20)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Sequelize](https://sequelize.org/) (ORM)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker & Docker Compose](https://www.docker.com/)
- [Zod](https://zod.dev/) (Validação de Env e DTOs)
- [GitHub Actions](https://github.com/features/actions) (CI/CD)

## :white_check_mark: Requisitos Atendidos ##

- [x] API RESTful completa.
- [x] Integração com Banco de Dados PostgreSQL via Docker.
- [x] Autenticação e proteção de rotas.
- [x] **Diferencial**: TDD (Testes Unitários implementados).
- [x] **Diferencial**: Pipeline de CI automatizada (Lint, Tests, Build).
- [x] **Diferencial**: Dockerização completa (Multi-stage build).

## :checkered_flag: Como rodar o projeto ##

Para rodar este projeto, você só precisa ter o **Docker** instalado em sua máquina.

Para garantir a compatibilidade, este projeto utiliza a versão **20.19.3** do Node.js.

### 1. Preparação do Ambiente
```bash
# Clone o projeto
$ git clone https://github.com/alvarobraz/vaga-desenvolvedor-alvaro-braz

$ cd vaga-desenvolvedor-alvaro-braz

# Garanta a versão correta do Node (NVM)
$ nvm use 20.19.3

# Instale as dependências do workspace
$ pnpm install


# Configure as variáveis de ambiente
$ cp apps/api/.env.example apps/api/.env

# Suba os containers (Banco + API)
$ docker compose up --build -d

# Executa as seeds de Admin e Products
$pnpm --filter @my-project/api seed:admin$ pnpm --filter @my-project/api seed:product

$ pnpm --filter @my-project/api start:dev

