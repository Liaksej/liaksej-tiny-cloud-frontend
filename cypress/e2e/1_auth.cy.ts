describe("My first test", () => {
  it("Does not to much", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Log in").click();
    cy.url().should("include", "http://localhost:3000/login");

    cy.get("input[name=email]").type("admin@example.com");
    cy.get("input[name=password]").type("45641231");
    cy.contains("Log in").click();
    cy.url().should("equal", "http://localhost:3000/dashboard");
    cy.getCookie("authjs.session-token").should("exist");
    cy.contains("Sign Out").click({ force: true });
  });
});
