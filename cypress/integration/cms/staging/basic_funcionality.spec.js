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

  //2 TC
  it("Create new Page in a location", () => {
    loadFirstLoc();

    //Check if pages exists
    cy.xpath("/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]").within(
      body => {
        if (body.find("span").length > 0) {
          cy.get("span.name-text").then($body => {
            if ($body.text().includes(pageName)) {
              //Deletes page if it exists
              cy.xpath(
                `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
              ).click();
              cy.get(".btn.delete-action.delete.ember-view").click();
              cy.wait(5000);
              cy.xpath("/html/body/div[16]/div[7]/div/button").should(
                "be.visible"
              );
              cy.xpath("/html/body/div[16]/div[7]/div/button").click();
            }
          });
        }
      }
    );

    //Create new page
    cy.wait(5000);
    cy.contains(" Create a New Page").click({ force: true });
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]/div/ul/li[1]/div/div[2]/div[1]/div[1]/input"
    )
      .type(pageName)
      .should("have.value", pageName);
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]/div/ul/li[1]/div/div[2]/div[1]/div[5]/div[2]/div/button[1]"
    ).click();
    cy.contains("Success").should("be.visible");
    cy.contains(pageName).should("be.visible");
  });

  //3 TC
  it("Change page name", () => {
    loadFirstLoc();
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click();
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]/div/ul/li/div/div[2]/div[1]/div[1]/input"
    )
      .clear()
      .should("have.value", "");
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]/div/ul/li/div/div[2]/div[1]/div[1]/input"
    )
      .type("NEW PAGE NAME")
      .should("have.value", "NEW PAGE NAME");
    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");
    cy.contains("NEW PAGE NAME").should("be.visible");
  });

  //4 TC
  it.only("Change page description", () => {
    loadFirstLoc();
    cy.xpath(
      `//span[.='NEW PAGE NAME']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]/div/ul/li[3]/div/div[2]/div[1]/div[3]/input"
    )
      .clear()
      .should("have.value", "");
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]/div/ul/li[3]/div/div[2]/div[1]/div[3]/input"
    )
      .type("NEW PAGE DESCRIPTION")
      .should("have.value", "NEW PAGE DESCRIPTION");
    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");
    cy.xpath(
      `//span[.='NEW PAGE NAME']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]/div/ul/li[3]/div/div[2]/div[1]/div[3]/input"
    ).should("have.value", "NEW PAGE DESCRIPTION");
  });
});
