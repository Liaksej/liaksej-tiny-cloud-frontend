import "cypress-file-upload";

describe("template spec", () => {
  beforeEach(function () {
    cy.login(Cypress.env().EMAIL, Cypress.env().PASSWORD);
  });

  it("Upload Single File And Edit", () => {
    cy.visit("/dashboard");
    cy.get("input[type='file']").attachFile("example.json");
    cy.get("textarea").type("This is a comment.");
    cy.contains("button, span", "Upload").click();
    cy.contains("example.json");
    cy.get(":nth-child(1) > .pr-3 > .flex > a.rounded-md > .w-5").click();
    cy.url().should("contain", "edit");
    cy.get("#comment").clear().type("This is a new comment.");
    cy.get("#pubclic").click();
    cy.get("button").contains("Save").click();
    cy.contains("This is a new comment");
    cy.contains("Copy Link").should("be.enabled");
    cy.get(":nth-child(1) > .pr-3 > .flex > a.rounded-md > .w-5").click();
    cy.get("#locked").click();
    cy.get("button").contains("Save").click();
    cy.contains("Copy Link").should("be.disabled");
    cy.get("button").contains("Delete").last().parent().parent().submit();
  });
});
