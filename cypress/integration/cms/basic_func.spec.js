/// <reference types="cypress" />

context("Basic Functionalities", () => {
  //VARIABLES
  var pageName = "NEW PAGE";
  var clientURN = "g5-c-5mc7konuw-ba-test-cave";

  //REUSABLE FUNCTIONS
  const loadFirstLoc = () => {
    cy.xpath(
      "/html/body/div[5]/main/div/div/div/div/div/div[2]/div[5]/ul[2]/li[1]/div/div/div[2]/div[3]/a[1]"
    )
      .click()
      .wait(5000);
    cy.contains("h4", "Navigation Pages").should("be.visible");
  };

  before(() => {
    //Switch between environments
    switch (Cypress.env("TESTING_ENV")) {
      case "prime":
        cy.visit(
          `${Cypress.env("BASE_URL_PRIME")}/clients/${clientURN}/websites`
        );
        break;
      case "prod":
        cy.visit(
          `${Cypress.env("BASE_URL_PROD")}/clients/${clientURN}/websites`
        );
        break;
      case "staging":
        cy.visit(
          `${Cypress.env("BASE_URL_STAGING")}/clients/${clientURN}/websites`
        );
        break;
      default:
        cy.visit(
          `${Cypress.env("BASE_URL_STAGING")}/clients/${clientURN}/websites`
        );
    }
  });

  beforeEach(() => {
    //Save auth cookies to stay logged in
    Cypress.Cookies.preserveOnce(
      "_g5-cms_session",
      "_g5-authentication_session"
    );
  });

  //1 TC
  it("1. Login CMS test", () => {
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
  it("2. Create new page test", () => {
    loadFirstLoc();
    //Check if pages exists
    cy.xpath("/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]").within(
      (body) => {
        if (body.text().includes(pageName)) {
          cy.get("span.name-text")
            .contains(pageName)
            .then(($body) => {
              //Deletes page if it exists
              cy.xpath(
                `//span[.='${$body.text()}']/following-sibling::span/a[.=' Settings ']`
              ).click({ force: true });
              cy.get(".btn.delete-action.delete.ember-view").click().wait(5000);
              cy.xpath("/html/body/div[16]/div[7]/div/button")
                .should("be.visible")
                .click()
                .wait(5000);
            });
        }
      }
    );

    //Create new page
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
  it("3. Change page name test", () => {
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
  it("4. Change page description test", () => {
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
  it("5. Change page child/parent status test", () => {
    loadFirstLoc();
    //Check if parent page exists
    cy.xpath("/html/body/div[5]/main/div/div/div/div[4]/div/div/div[4]").within(
      (body) => {
        if (body.text().includes("NEW PARENT PAGE")) {
          cy.get("span.name-text")
            .contains("NEW PARENT PAGE")
            .then(($body) => {
              //Deletes page if it exists
              cy.xpath(
                `//span[.='${$body.text()}']/following-sibling::span/a[.=' Settings ']`
              ).click({ force: true });
              cy.get(".btn.delete-action.delete.ember-view").click().wait(5000);
              cy.xpath("/html/body/div[16]/div[7]/div/button")
                .should("be.visible")
                .click()
                .wait(5000);
            });
        }
      }
    );

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
    cy.reload().wait(3000);
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
    cy.get(".btn.delete-action.delete.ember-view").click().wait(5000);
    cy.xpath("/html/body/div[16]/div[7]/div/button")
      .should("be.visible")
      .click();
    cy.xpath(
      `//span[.='NEW PARENT PAGE']/following-sibling::span/a[.=' Settings ']`
    ).should("have.length", 0);
  });

  //6 TC
  it("6. Disable and enable page test", () => {
    loadFirstLoc();
    //Change to disabled status
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.get(".page-status-toggle").find("span.lever").click({ force: true });
    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");

    //verify it's disabled
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.get(".page-status-toggle")
      .find("input[type=checkbox]:checked+.lever")
      .should("have.length", 0);

    //Change to enabled status
    cy.get(".page-status-toggle").find("span.lever").click({ force: true });
    cy.get(".agree-button").click({ force: true });
    cy.contains("Success").should("be.visible");

    //verify it's enabled
    cy.get(".page-status-toggle")
      .find("input[type=checkbox]:checked+.lever")
      .should("have.length", 1);
  });

  //7 TC
  it("7. Import remote page layout test", () => {
    let remoteClient = "1-800 Self Storage - Client";
    let remoteLoc =
      "1-800-SELF-STORAGE.com - 1-800-Self-Storage.com on Greenfield";
    loadFirstLoc();

    //Import contact us page from first location from the list in 1-800 Self Storage - Client
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    ).click({ force: true });
    cy.get("div.page-layout").contains("Import Layout").click({ force: true });
    cy.get("div.import-clients")
      .contains("li", remoteClient)
      .click({ force: true })
      .wait(5000);
    cy.get("div.import-websites")
      .contains("li", remoteLoc)
      .click({ force: true });
    cy.get("div.import-pages")
      .contains("li", "Contact Us")
      .click({ force: true });
    cy.get("a.import-layout.btn").click({ force: true }).wait(5000);
    cy.get(".sa-confirm-button-container > .confirm").click();

    //Verify it was cloned correctly by counting stripes on page
    cy.contains("Success").should("be.visible");
    cy.reload().wait(5000);
    cy.xpath(
      `//span[.='${pageName}']/following-sibling::span/a[.=' Settings ']`
    )
      .click({ force: true })
      .wait(5000);
    cy.get("div.page-layout")
      .find(".sortable-item.ember-view")
      .should("have.length", 2);
  });

  //8 TC
  it("7. Clone remote location to CMS test", () => {});
});
