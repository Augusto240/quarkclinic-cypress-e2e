# Automação de Testes E2E - QuarkClinic 🏥

> Projeto desenvolvido como parte do processo seletivo para estágio em QA (Automação) na **ESIG Group / Quark Tecnologia**.

Este repositório contém a automação dos fluxos críticos da jornada de agendamento online de uma clínica fictícia, garantindo a qualidade e funcionalidade do sistema.

## 🛠️ Tecnologias Utilizadas

* **[Cypress](https://www.cypress.io/)** (v15.4.0+): Framework de testes E2E.
* **JavaScript**: Linguagem de script.
* **Node.js**: Ambiente de execução.
* **Faker/Randomização**: Geração dinâmica de massas de dados para cadastro.

## 📋 Cenários Automatizados

O projeto cobre 4 fluxos principais ("Ponta a Ponta"):

| Fluxo | Descrição | Status |
| :--- | :--- | :---: |
| **01** | **Cadastro de Novo Usuário**: Criação de conta com dados dinâmicos e validação de acesso. | ✅ |
| **02** | **Login de Usuário**: Autenticação com credenciais válidas e validação de sessão. | ✅ |
| **03** | **Agendamento de Consulta**: Fluxo completo de escolha de convênio, especialidade, médico, horário e confirmação. | ✅ |
| **04** | **Envio de Comprovante (Bônus)**: Fluxo de upload de arquivo e envio de comprovante bancário pós-agendamento. | ✅ |

## ✨ Destaques da Implementação

Para atender aos critérios de **Qualidade de Código** e **Robustez**, foram aplicadas as seguintes práticas:

* **Interceptação de Rotas (`cy.intercept`):** O teste aguarda as requisições da API (backend) finalizarem antes de prosseguir, eliminando a necessidade de `cy.wait(5000)` estáticos e evitando *flaky tests*.
* **Seletores Resilientes:** Prioridade para atributos `data-cy` e uso de estratégias como `.first()` e `{force: true}` para lidar com elementos dinâmicos ou sobrepostos.
* **Pré-condições Inteligentes:** No fluxo de pagamento (04), o teste reconstrói o estado necessário (realiza um agendamento prévio) automaticamente via código (`beforeEach`), garantindo que o teste seja independente.
* **Assertivas Precisas:** Validação não apenas visual, mas também dos códigos de status HTTP (200/201) das requisições críticas.
