/// <reference types="cypress" />

context("Basic Functionalities", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("BASE_URL_STAGING"));
    Cypress.Cookies.preserveOnce(
      "_g5-cms_session",
      "_g5-authentication_session"
    );
  });

  it("Login to CMS", () => {
    cy.visit("https://auth.g5search.com");
    cy.get("#user_email")
      .type(Cypress.env("cms_auth_email"))
      .should("have.value", Cypress.env("cms_auth_email"));
    cy.get("#user_password").type("wrong_password");
    cy.contains("Sign In").click();
    cy.contains("Invalid email or password.").should("be.visible");
    cy.get("#user_password").type(Cypress.env("cms_auth_password"));
    cy.contains("Sign In").click();
    cy.contains("Signed in successfully.").should("be.visible");
  });

  it("Create a new Page in a location", () => {
    cy.contains("BRYAN TESTBED");
  });
});
