import "cypress-file-upload";

describe("Manage Files", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    if (err.message.includes("NEXT_REDIRECT")) {
      return false;
    }
  });
  before(function () {
    cy.login(Cypress.env().EMAIL, Cypress.env().PASSWORD);
  });

  it("Upload Multiple Files And Delete", () => {
    cy.visit("/dashboard");
    for (let i = 0; i < 11; i++) {
      cy.get("input[type='file']").attachFile("example.json");
      cy.contains("example.json");
      cy.get("textarea").type("This is a comment.");
      cy.contains("button, span", "Upload").click();
    }
    cy.get("a").contains("2").click();
    cy.url().should("equal", "http://localhost:3000/dashboard?page=2");
    cy.get("button").contains("Delete").last().parent().parent().submit();
    cy.url().should("equal", "http://localhost:3000/dashboard");
    for (let i = 0; i < 10; i++) {
      cy.get("button").contains("Delete").last().parent().parent().submit();
      cy.wait(1000);
    }
    cy.contains("There is no files yet. Add some.");
  });
});
