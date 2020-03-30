/// <reference types="cypress" />

context('Basic Functionalities', () => {
    beforeEach(() => {
      cy.visit(Cypress.env('BASE_URL_STAGING'))
    })

    it('Login to CMS', () => {
      cy.get('#user_email')
      .type(Cypress.env('cms_auth_email')).should('have.value', Cypress.env('cms_auth_email'))
      cy.get('#user_password')
      .type("wrong_password")
      cy.contains('Invalid email or password.').should('be.visible')      
      cy.get('#user_password')
      .type(Cypress.env('cms_auth_password'))
      cy.contains('Sign In').click()
      cy.url().should('eq', Cypress.env('BASE_URL_STAGING'))
    })
    
  })