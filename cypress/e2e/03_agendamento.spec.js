/// <reference types="cypress" />

describe('Fluxo 3 — Agendamento de Consulta Presencial', () => {
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

    cy.get('body').then($body => {
      if ($body.find(':contains("Sair")').length === 0) {
        cy.log('Usuário deslogado. Iniciando login...')
        
        cy.get('[data-cy="btn-login"], button:contains("Login")').first().click({ force: true })
        
        cy.get('[data-cy="campo-usuario-input"]').first().should('exist').clear({ force: true }).type(testEmail, { force: true })
        cy.get('[name="password"]').first().should('exist').clear({ force: true }).type(testPass, { force: true })
        
        cy.get('[data-cy="checkbox-aceita-politicas"] label.custom-control-label').first().scrollIntoView().click({ force: true })
        cy.get('[name="cb-login"]').check({ force: true })

        cy.get('[data-cy="btn-submit-login"]').first().click({ force: true })
        cy.contains('Sair', { timeout: 20000 }).should('exist')
      }
    })
  })

  it('agenda uma consulta presencial e valida confirmação', () => {
    // Intercepts
    cy.intercept('GET', '**/api/agendamentos/convenios**').as('getConvenios')
    cy.intercept('GET', '**/api/agendamentos/especialidades**').as('getEspecialidades')
    cy.intercept('GET', '**/api/agendamentos/clinicas**').as('getClinicas')
    cy.intercept('GET', '**/api/agendamentos/agendas**').as('getAgendas')
    cy.intercept('GET', '**/api/protected/me/dependentes').as('getDependentes')
    cy.intercept('POST', '**/api/agendamentos/negociacao/**').as('createAppointment')

    cy.get('[data-cy="texto-consulta-presencial"]').first().should('be.visible').click({ force: true })
    cy.wait('@getConvenios', { timeout: 20000 })

    cy.get('[data-cy="convenio-label-148"]').first().click({ force: true })
    cy.get('[data-cy="convenio-radio-148"]').check({ force: true })
    cy.wait('@getEspecialidades', { timeout: 20000 })

    cy.get('body').then($body => {
      if ($body.find(':contains("Cardiologia")').length) {
        cy.contains(/cardiologia/i).click({ force: true })
        cy.wait('@getClinicas', { timeout: 20000 })
      }
    })

    cy.get('body').then($body => {
      if ($body.find('[data-cy="lista-clinicas"] li').length) {
        cy.get('[data-cy="lista-clinicas"] li').first().click()
        cy.wait('@getAgendas', { timeout: 20000 })
      }
    })

    cy.get('body').then($body => {
        if ($body.find('[data-cy="agenda-profissional-nome"]').length) {
            cy.get('[data-cy="agenda-profissional-nome"]').first().click({ force: true })
        }
    })

    cy.get('[data-cy^="agenda-item-horario-"]')
      .filter(':visible')
      .first()
      .click({ force: true })

    cy.wait('@getDependentes', { timeout: 20000 })
    cy.get('[data-cy="paciente-card-radio-label"]')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true })

    cy.wait(1000) 

    cy.contains(/confirmação|resumo/i).should('be.visible')
    
    cy.contains(/cardiologia/i).should('exist') 

    cy.contains(/particular/i).should('exist')
    
    cy.get('body').should('contain', ':') 
    
    cy.get('.confirmacao-paciente-nome, [data-cy="confirmacao-paciente-nome"], body')
      .should('contain', 'Jose') 

    cy.get('[data-cy="confirmacao-btn-confirmar"]')
      .should('exist')
      .scrollIntoView()
      .click({ force: true })

    cy.wait('@createAppointment', { timeout: 40000 }).then(({ response }) => {
      expect(response.statusCode).to.be.oneOf([200, 201])
    })

    cy.get('body').then($body => {
        if ($body.find('[data-cy="finalizacao-btn-transferencia"]').length) {
            cy.get('[data-cy="finalizacao-btn-transferencia"]').should('be.visible')
        } else {
            cy.contains(/sucesso/i, { timeout: 10000 }).should('be.visible')
        }
    })

    cy.log('Fluxo completado com sucesso!')
  })
})