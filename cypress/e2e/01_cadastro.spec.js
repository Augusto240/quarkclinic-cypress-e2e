/// <reference types="cypress" />
describe('Fluxo 1 — Cadastro de Novo Usuário', () => {
  const orgPath = '/index/363622206'
  const submitSel = '[data-cy="btn-criar-conta"]'
  const dropdownSel = '[data-cy="dropdown-usuario-logado"] button'

  beforeEach(() => {
    cy.visit(orgPath)
    cy.url().should('include', orgPath)
    cy.closeConsentIfShown()
  })

  it('cria conta e verifica saudação no header', () => {
    const email = `jose.${Date.now()}@example.com`

    cy.get('[data-cy="btn-cadastro"]').should('be.visible').click()

    cy.get('[data-cy="campo-nome-input"]').should('be.visible').clear().type('Jose')
    cy.get('[data-cy="campo-telefone-input"]').should('be.visible').clear().type('(84) 9999-9999')
    cy.get('[data-cy="campo-sexo-select"]').should('be.visible').select('MASCULINO')
    cy.get('[data-cy="campo-data-nascimento-input"]').should('be.visible').clear().type('22/07/2013')
    cy.get('input[placeholder="Email"]').should('be.visible').clear().type(email)
    cy.get('[data-cy="campo-numero-documento-input"]').should('be.visible').clear().type('638.764.670-71')
    cy.get('#senha').should('be.visible').clear().type('123456')
    cy.get('[data-cy="campo-confirmar-senha-input"]').should('be.visible').clear().type('123456')

    const labelSel = '[data-cy="checkbox-aceita-politicas-cadastro"] label.custom-control-label'
    const inputSel = '[name="cb-cadastro"]'
    cy.get('body').then($body => {
      if ($body.find(labelSel).length) {
        cy.get(labelSel).scrollIntoView().click({ force: false })
      }
      cy.get(inputSel, { timeout: 8000 }).then($cb => {
        if (!$cb.is(':checked')) {
          if (Cypress.dom.isVisible($cb)) {
            cy.wrap($cb).check().should('be.checked')
          } else {
            cy.wrap($cb).check({ force: true }).should('be.checked')
          }
        }
      })
    })

    cy.intercept('POST', '**/api/**').as('createAccount')
    cy.intercept('GET', '**/api/protected/me').as('me')

    cy.get(submitSel).should('exist').scrollIntoView().click()

    cy.wait('@createAccount', { timeout: 20000 }).then(({ response }) => {
      expect(response).to.exist
      if (response.statusCode === 422) {
        throw new Error(`API retornou 422 (email duplicado). Resposta: ${JSON.stringify(response.body)}`)
      }
      expect(response.statusCode).to.be.within(200, 299)
    })

    cy.get(dropdownSel, { timeout: 20000 }).should('be.visible').and('contain', 'Jose')

    cy.get(dropdownSel).click()
    cy.get('[data-cy="dropdown-item-agendar"]').should('contain', 'Agendar')
    cy.get('[data-cy="dropdown-item-sair-logado"]').should('contain', 'Sair')

    cy.log(`Email de teste: ${email}`)
  })
})
