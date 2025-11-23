# Automação de Testes E2E — QuarkClinic

> Projeto desenvolvido como parte do processo seletivo para estágio em QA (Automação) na **ESIG Group / Quark Tecnologia**.

Este repositório contém a automação dos fluxos críticos da jornada de agendamento online da clínica fictícia *Clinic Mol*, garantindo a qualidade e funcionalidade do sistema por meio de testes End-to-End.

## Tecnologias Utilizadas

* **[Cypress](https://www.cypress.io/)** (v15.4.0) — Framework de testes automatizados
* **JavaScript** — Linguagem utilizada
* **Node.js** — Ambiente de execução
* **Faker / Randomização** — Estratégias para geração de massa de dados (e-mails dinâmicos)

## Cenários Automatizados

O projeto cobre 4 fluxos principais (testes ponta a ponta):

|  Fluxo | Descrição                                                                        | Status |
| :----: | :------------------------------------------------------------------------------- | :----: |
| **01** | Cadastro de novo usuário com dados dinâmicos e validação de acesso.              |    ✅   |
| **02** | Login com credenciais válidas e verificação de sessão.                           |    ✅   |
| **03** | Agendamento de consulta: convênio, especialidade, médico, horário e confirmação. |    ✅   |
| **04** | Envio de comprovante pós-agendamento (upload de arquivo).                        |    ✅   |

## Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 14 ou superior)
* [Git](https://git-scm.com/)

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/Augusto240/quarkclinic-cypress-e2e
   ```

2. Acesse a pasta do projeto:

   ```bash
   cd quarkclinic-cypress-e2e
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

## Como Rodar os Testes

### Modo Headless (terminal)

Executa todos os testes sem interface gráfica e exibe o resultado no console. Ideal para CI/CD.

```bash
npm run cypress:run
```

### Modo Interativo (Cypress App)

Abre a interface visual do Cypress, permitindo acompanhar os testes no navegador.

```bash
npm run cypress:open
```

## Destaques da Implementação

* **Interceptação de rotas (`cy.intercept`)**
  Os testes aguardam respostas reais da API antes de prosseguir, evitando esperas estáticas e reduzindo flaky tests.

* **Seletores resilientes**
  Prioridade para atributos `data-cy`, uso de `.first()` e `{ force: true }` quando necessário para lidar com elementos dinâmicos ou sobreposições.

* **Pré-condições automatizadas**
  Em fluxos que exigem estado prévio (por exemplo, upload de comprovante), o teste reconstrói o estado necessário no `beforeEach`, garantindo independência e atomicidade.

* **Assertivas robustas**
  Validações não se limitam à interface: são verificadas também as respostas HTTP (200/201) das requisições críticas.


---
