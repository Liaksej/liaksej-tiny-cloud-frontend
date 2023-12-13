describe("Login page", () => {
  before(() => {
    cy.log(`Visiting https://company.tld`);
    cy.visit("/");
  });
  it("Login with credentials", () => {
    const email = Cypress.env("EMAIL");
    const password = Cypress.env("PASSWORD");
    const loginUrl = Cypress.env("SITE_NAME/login");
    const cookieName = Cypress.env("COOKIE_NAME");
    const credentidalsLoginOptions = {
      email,
      password,
      loginUrl,
      headless: true,
      logs: false,
      isPopup: false,
      loginSelector: `a[href="${Cypress.env("SITE_NAME")}/login"]`,
      postLoginSelector: ".unread-count",
    };

    // @ts-ignore
    return cy
      .task("CredentialsLogin", credentidalsLoginOptions)
      .then(({ cookies }) => {
        cy.clearCookies();

        const cookie = cookies
          .filter((cookie) => cookie.name === cookieName)
          .pop();
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          });

          // remove the two lines below if you need to stay logged in
          // for your remaining tests
          cy.visit("/api/auth/signout");
          cy.get("form").submit();
        }
      });
  });
});
