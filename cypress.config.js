const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://agendamento.quarkclinic.com.br',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/*.spec.js',
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 60000,
    video: false
  }
})
