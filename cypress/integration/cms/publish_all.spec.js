/// <reference types="cypress" />

context("Publish all with URLS", () => {
  //Here you can add urls
  const urls = [
    "https://content-management-system-content-staging.g5devops.com/clients/g5-c-5mc7konuw-ba-test-cave/websites",
    "https://content-management-system-content-staging.g5devops.com/clients/g5-c-5hy5a7o9b-sites-qa-ccms-testbed/websites",
  ];

  beforeEach(() => {
    //Save auth cookies to stay logged in
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

  urls.forEach((url) => {
    it(`Should click on publish all button on ${url}`, () => {
      cy.visit(url);
      cy.get("a.deploy-all").find("span").click({ force: true }).wait(3000);
      cy.get(".sa-confirm-button-container > .confirm").click();
      cy.contains(
        "Publishing all deployable websites. This will take some time."
      ).should("be.visible");
    });
  });
});
