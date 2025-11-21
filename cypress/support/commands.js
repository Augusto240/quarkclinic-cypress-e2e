Cypress.Commands.add('closeConsentIfShown', () => {
  cy.get('body').then($body => {
    if ($body.find('[data-cy="btn-footer-entendi"]').length) {
      cy.get('[data-cy="btn-footer-entendi"]').click()
    }
  })
})

Cypress.Commands.add('uniqueEmail', (prefix = 'user') => {
  return `${prefix}.${Date.now()}@example.com`
})
