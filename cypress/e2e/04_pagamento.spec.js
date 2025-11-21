/// <reference types="cypress" />

describe('Fluxo 4 — Envio de Comprovante (Bônus)', () => {
  const orgPath = '/index/363622206'
  const testEmail = 'jose@esig.com'
  const testPass = '123456'

  const realizarAgendamentoPrevio = () => {
    cy.log('--- PRE-CONDIÇÃO: Realizando agendamento para acessar tela de pagamento ---')

    cy.get('body').then($body => {
      if ($body.find(':contains("Sair")').length === 0) {
        cy.get('[data-cy="btn-login"], button:contains("Login")').first().click({ force: true })
        cy.get('[data-cy="campo-usuario-input"]').first().should('exist').clear({ force: true }).type(testEmail, { force: true })
        cy.get('[name="password"]').first().should('exist').clear({ force: true }).type(testPass, { force: true })
        cy.get('[data-cy="checkbox-aceita-politicas"] label').first().scrollIntoView().click({ force: true })
        cy.get('[data-cy="btn-submit-login"]').first().click({ force: true })
        cy.contains('Sair', { timeout: 20000 }).should('exist')
      }
    })

    cy.get('[data-cy="texto-consulta-presencial"]').first().should('be.visible').click({ force: true })

    cy.get('[data-cy="convenio-label-148"]').first().should('be.visible').click({ force: true }) 
    cy.get('[data-cy="convenio-radio-148"]').check({ force: true })

    cy.get('body').then($body => {
      if ($body.find(':contains("Cardiologia")').length) {
        cy.contains(/cardiologia/i).click({ force: true })
      }
    })

    cy.get('body').then($body => {
      if ($body.find('[data-cy="lista-clinicas"] li').length) {
        cy.get('[data-cy="lista-clinicas"] li').first().click()
      }
    })

    cy.get('body').then($body => {
        if ($body.find('[data-cy="agenda-profissional-nome"]').length) {
            cy.get('[data-cy="agenda-profissional-nome"]').first().click({ force: true })
        }
    })

    cy.get('[data-cy^="agenda-item-horario-"]').filter(':visible').first().click({ force: true })

    cy.get('[data-cy="paciente-card-radio-label"]').first().scrollIntoView().click({ force: true })
    cy.wait(1000)

    cy.get('[data-cy="confirmacao-btn-confirmar"]').should('exist').click({ force: true })

    cy.contains(/sucesso/i, { timeout: 20000 }).should('be.visible')
    cy.log('--- FIM PRE-CONDIÇÃO ---')
  }

  beforeEach(() => {
    cy.visit(orgPath)
    cy.get('body').then($body => {
      if ($body.find('[data-cy="btn-footer-entendi"]').length) {
        cy.get('[data-cy="btn-footer-entendi"]').first().click({ force: true })
      }
    })

    realizarAgendamentoPrevio()
  })

  it('envia comprovante por transferência bancária e valida mensagem de agradecimento', () => {
    cy.get('[data-cy="finalizacao-btn-transferencia"]')
      .should('be.visible')
      .click({ force: true })

    cy.get('#comprovante, input[type="file"]')
      .first()
      .selectFile({
        contents: Cypress.Buffer.from('arquivo de teste'),
        fileName: 'comprovante.jpg',
        mimeType: 'image/jpeg',
      }, { force: true })

    cy.get('[data-cy="pagamento-form-textarea-observacao"], textarea[name="observacao"]')
      .should('be.visible')
      .clear({ force: true })
      .type('Comprovante de teste', { force: true })
    
    cy.intercept('POST', '**/api/**').as('sendProof')
    
    cy.get('[data-cy="pagamento-form-btn-enviar"]')
      .should('be.visible')
      .click({ force: true })

    cy.wait('@sendProof', { timeout: 20000 }).then(({ response }) => {
      expect(response.statusCode).to.be.within(200, 299)
    })

    cy.contains(/Obrigado por enviar/i, { timeout: 15000 }).should('be.visible')
  })
})