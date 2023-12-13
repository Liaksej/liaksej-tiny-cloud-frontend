describe("template spec", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    if (
      err.message.includes(
        "Objects are not valid as a React child (found: object with keys {username}). If you meant to render a collection of children, use an array instead.",
      )
    ) {
      return false;
    }
  });
  it("passes", () => {
    cy.visit("/signup");
    cy.get("input[name='username']").type("z9z");
    cy.get("input[name='email']").type("test@test");
    cy.get("input[name='password1']").type("test");
    cy.get("input[name='password2']").type("test");
    cy.get("input[name='first_name']").type("test");
    cy.get("input[name='last_name']").type("test");
    cy.contains("button, span", "Sign in").click();
    cy.contains("String must contain at least 4 character(s)");
    cy.contains("Invalid email");
    cy.contains(
      "String must contain at least 6 character(s)Password must contain at least one uppercase letter, one number, and one special character",
    );
    cy.get("input[name='username']").clear().type("z9z9z9z9z9z9z9z9z9z9");
    cy.contains("button, span", "Sign in").click();
    cy.contains("String must contain at least 4 character(s)").should(
      "not.exist",
    );
    cy.contains("button, span", "Sign in").click();
    cy.get("input[name='email']").clear().type("test@test.com");
    cy.contains("button, span", "Sign in").click();
    cy.contains("Invalid email").should("not.exist");
    cy.get("input[name='password1']").clear().type("verystrongpassword123$A");
    cy.get("input[name='password2']").clear().type("verystrongpassword123$A");
    cy.contains("button, span", "Sign in").click();
    cy.wait(500);
    cy.url().should("equal", "http://localhost:3000/dashboard");
  });

  it("cleanup", () => {
    cy.login(Cypress.env().EMAIL, Cypress.env().PASSWORD);
    cy.visit("/dashboard");
    cy.contains("Admin panel").click();
    cy.contains("z9z9z9z9z9z9z9z9z9z9");
  });
});
