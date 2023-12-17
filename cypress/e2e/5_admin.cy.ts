describe("template spec", () => {
  beforeEach(function () {
    cy.login(Cypress.env().EMAIL, Cypress.env().PASSWORD);
  });

  it("passes", () => {
    cy.visit("/dashboard");
    cy.contains("Admin panel").click();
    cy.url().should("equal", "http://localhost:3000/admin");
    cy.get("input[type='checkbox']")
      .last()
      .then(($checkbox) => {
        // Проверяем, установлен ли флажок
        if ($checkbox.prop("checked")) {
          // Если установлен, кликаем на чекбокс и проверяем что он не установлен
          cy.wrap($checkbox).click().should("not.be.checked");
        } else {
          // Если не установлен, кликаем на чекбокс и проверяем что он установлен
          cy.wrap($checkbox).click().should("be.checked");
        }
      });
    cy.get("input[type='checkbox']").last().click();
    cy.get("button")
      .contains("Delete")
      .last()
      .parent()
      .parent()
      .click({ force: true });
  });
});
