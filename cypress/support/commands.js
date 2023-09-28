// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
    return cy.get(`[data-test="${dataTestSelector}"]`)
})

Cypress.Commands.add('createUser', (user) => {
    cy.getDataTest('first-name-input').type(user['first-name']);
    cy.getDataTest('last-name-input').type(user['last-name']);
    cy.getDataTest('username-input').type(user['username']);
    cy.getDataTest('email-input').type(user['email']);
    cy.getDataTest('password1-input').type(user['password']);
    cy.getDataTest('password2-input').type(user['password']);
    cy.getDataTest('submit-button').click();
    return cy.getDataTest('registered-message').should('contain.text',`welcome ${user['username']}, you are now registered`)
})