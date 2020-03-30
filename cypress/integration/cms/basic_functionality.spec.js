/// <reference types="cypress" />

context('Basic Functionalities', () => {
    beforeEach(() => {
      cy.visit(Cypress.env('TESTING_CLIENT_URL'))
    })

    it('Login to CMS', () => {
    })

  })