/// <reference types="cypress" />

describe('Fluxo 2 — Login de Usuário', () => {
  const orgPath = '/index/363622206'
  const testEmail = 'jose@esig.com'
  const testPass = '123456'

  beforeEach(() => {
    cy.visit(orgPath)
    cy.get('body').then($body => {
      if ($body.find('[data-cy="btn-footer-entendi"]').length) {
        cy.get('[data-cy="btn-footer-entendi"]').first().click({ force: true })
      }
    })
  })

  it('faz login com usuário existente e valida redirecionamento', () => {
    cy.get('[data-cy="btn-login"], button:contains("Login")')
      .first()
      .should('be.visible')
      .click({ force: true })

    cy.get('[data-cy="campo-usuario-input"]')
      .first()
      .should('exist')
      .clear({ force: true })
      .type(testEmail, { force: true })

    cy.get('[data-cy="campo-senha-input"], [name="password"]')
      .first()
      .should('exist')
      .clear({ force: true })
      .type(testPass, { force: true })

    cy.get('[data-cy="checkbox-aceita-politicas"] label')
      .first()
      .scrollIntoView()
      .click({ force: true })
    
    cy.get('[name="cb-login"]').check({ force: true })

    cy.intercept('POST', '**/api/auth/login').as('loginRequest')

    cy.get('[data-cy="btn-submit-login"]')
      .first()
      .click({ force: true })

    cy.wait('@loginRequest', { timeout: 15000 }).then(({ response }) => {
      expect(response.statusCode).to.be.within(200, 299)
    })
    cy.get('[data-cy="dropdown-usuario-logado"] button')
      .should('be.visible') 
      .and('contain', 'Jose') 
  })
})