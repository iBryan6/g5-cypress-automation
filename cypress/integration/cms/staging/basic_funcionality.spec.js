/// <reference types="cypress" />

context("Basic Functionalities", () => {
  //VARIABLES
  var pageName = "NEW PAGE";

  //REUSABLE FUNCTIONS
  const loadFirstLoc = () => {
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div/div/div[2]/div[5]/ul[2]/li[1]/div/div/div[2]/div[3]/a[1]"
    ).click();
    cy.wait(5000);
    cy.contains("h4", "Navigation Pages").should("be.visible");
  };

  beforeEach(() => {
    cy.visit(Cypress.env("BASE_URL_STAGING"));
    Cypress.Cookies.preserveOnce(
      "_g5-cms_session",
      "_g5-authentication_session"
    );
  });

  //1 TC
  it("1. Login to CMS", () => {
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

  //2 TC
  it("2. Create new Page in a location", () => {
    loadFirstLoc();
    //Check if pages exists
    cy.xpath("/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]").within(
      body => {
        if (body.find("span").length > 0) {
          cy.get("span.name-text").then($body => {
            if ($body.text().includes(pageName)) {
              //Deletes page if it exists
              cy.xpath(
                `//span[.='${$body.text()}']/following-sibling::span/a[.=' Settings ']`
              ).click({ force: true });
              cy.get(".btn.delete-action.delete.ember-view").click();
              cy.wait(5000);
              cy.xpath("/html/body/div[16]/div[7]/div/button")
                .should("be.visible")
                .click();
            }
          });
        }
      }
    );

    //Create new page
    cy.wait(5000);
    cy.contains(" Create a New Page").click({ force: true });
    cy.get("input.validate.ember-text-field.ember-view")
      .eq(0)
      .should("have.value", "")
      .type(pageName)
      .should("have.value", pageName);
    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");
    cy.contains(pageName).should("be.visible");
  });

  //3 TC
  it("3. Change page name", () => {
    loadFirstLoc();
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    pageName = "NEW PAGE NAME";
    cy.get("input.validate.ember-text-field.ember-view")
      .eq(0)
      .clear()
      .should("have.value", "")
      .type(pageName)
      .should("have.value", pageName);
    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");
    cy.contains(pageName).should("be.visible");
  });

  //4 TC
  it("4. Change page description", () => {
    loadFirstLoc();
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.get("input.validate.ember-text-field.ember-view")
      .eq(2)
      .clear()
      .should("have.value", "")
      .type("NEW PAGE DESCRIPTION")
      .should("have.value", "NEW PAGE DESCRIPTION");
    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.get("input.validate.ember-text-field.ember-view")
      .eq(2)
      .should("have.value", "NEW PAGE DESCRIPTION");
  });

  //5 TC
  it("5. Change page child/parent status", () => {
    loadFirstLoc();
    //Create parent page
    cy.contains(" Create a New Page").click({ force: true });
    cy.get("input.validate.ember-text-field.ember-view")
      .eq(0)
      .should("have.value", "")
      .type("NEW PARENT PAGE")
      .should("have.value", "NEW PARENT PAGE");

    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");
    cy.contains("NEW PARENT PAGE").should("be.visible");

    //Change to child page
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.get(".dropdown-content.select-dropdown")
      .contains("li", "NEW PARENT PAGE")
      .click({ force: true });
    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");

    //Check if it's a child page
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.get(".page-status-row")
      .find("input.select-dropdown")
      .should("have.value", "NEW PARENT PAGE");

    //Change to parent page
    cy.get(".dropdown-content.select-dropdown")
      .contains("li", "None")
      .click({ force: true });
    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");

    //Check if it's a parent page
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.get(".page-status-row")
      .find("input.select-dropdown")
      .should("have.value", "Add to Parent Page...");
    cy.get(".cancel-button").click({ force: true });

    //Delete created page
    cy.xpath(
      `//span[.='NEW PARENT PAGE']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.get(".btn.delete-action.delete.ember-view").click();
    cy.wait(5000);
    cy.xpath("/html/body/div[16]/div[7]/div/button")
      .should("be.visible")
      .click();
  });
});
