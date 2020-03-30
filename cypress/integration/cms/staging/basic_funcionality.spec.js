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
    //Type Email
    cy.get("#user_email")
      .type(Cypress.env("cms_auth_email"))
      .should("have.value", Cypress.env("cms_auth_email"));
    //Type wrong password
    cy.get("#user_password").type("wrong_password");
    cy.contains("Sign In").click();
    cy.contains("Invalid email or password.").should("be.visible");
    //Type correct password
    cy.get("#user_password").type(Cypress.env("cms_auth_password"));
    cy.contains("Sign In").click();
    cy.contains("Signed in successfully.").should("be.visible");
  });

  it("Create a new Page in a location", () => {
    //Load first location edit
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div/div/div[2]/div[5]/ul[2]/li[1]/div/div/div[2]/div[3]/a[1]"
    ).click();
    cy.contains(" Create a New Page").should("be.visible");
    //Create new page
    cy.contains(" Create a New Page").click({ force: true });
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]/div/ul/li[1]/div/div[2]/div[1]/div[1]/input"
    )
      .type("NEW PAGE")
      .should("have.value", "NEW PAGE");
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]/div/ul/li[1]/div/div[2]/div[1]/div[5]/div[2]/div/button[1]"
    ).click();
    cy.contains("Success").should("be.visible");
    cy.contains("NEW PAGE").should("be.visible");
  });
});
