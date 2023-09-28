const bad_input = require('../fixtures/test_users.json').register_bad_input;
const good_input = require('../fixtures/test_users.json').register_good_input;

describe('registration', () => {
    beforeEach(()=>{
      cy.visit('/users/register');
    })

it('registration page loaded', () => {
  cy.location('pathname').should("eq", '/users/register');
})

  it('correct title', () => {
    cy.title().should('eq', 'register');
  })

  it('correct logo', () => {
    cy.getDataTest('navbar-logo').should('contain.text', 'MorChat');
  })

  it('correct nav bottun', () => {
    cy.getDataTest('nav-home').should('have.attr', 'href', '/');
    cy.getDataTest('nav-about').should('have.attr', 'href', '/about');
    cy.getDataTest('nav-contact').should('have.attr', 'href', '/contact');
    cy.getDataTest('nav-login').should('have.attr', 'href', '/users/login');
    cy.getDataTest('nav-logout').should('not.exist');
    cy.getDataTest('nav-chat').should('not.exist');
  })

  it('correct active nav', () => {
    cy.getDataTest('nav-home').should('not.have.class', 'active');
    cy.getDataTest('nav-about').should('not.have.class', 'active');
    cy.getDataTest('nav-contact').should('not.have.class', 'active');
  })


  it('error message not exist', () => {
    cy.getDataTest('register-error-message-0').should('not.exist');
  })

  it('correct header', () => {
    cy.getDataTest('register-title').should('contain.text', 'Register');
  })

  it('correct footer', () => {
    cy.getDataTest('footer-h2').should('contain.text', '***');
    cy.getDataTest('footer-p').should('exist');
  })

  it('create a user successfully', () =>{
    cy.getDataTest('first-name-input').type(good_input[0]['first-name']);
    cy.getDataTest('last-name-input').type(good_input[0]['last-name']);
    cy.getDataTest('username-input').type(good_input[0]['username']);
    cy.getDataTest('email-input').type(good_input[0]['email']);
    cy.getDataTest('password1-input').type(good_input[0]['password1']);
    cy.getDataTest('password2-input').type(good_input[0]['password2']);
    cy.getDataTest('submit-button').click();
    cy.location('pathname').should("eq", '/');
    cy.getDataTest('registered-message').should('contain.text',`welcome ${good_input[0]['username']}, you are now registered`)
})

    bad_input.forEach(input => {
        it(input['explain'], () =>{

            cy.getDataTest('first-name-input').type(input['first-name']);
            cy.getDataTest('last-name-input').type(input['last-name']);
            cy.getDataTest('username-input').type(input['username']);
            cy.getDataTest('email-input').type(input['email']);
            cy.getDataTest('password1-input').type(input['password1']);
            cy.getDataTest('password2-input').type(input['password2']);
            cy.getDataTest('submit-button').click();
            cy.getDataTest('register-error-message-0').should('contain.text', input['error-message']);
        })
    });

    it('create another user successfully', () =>{
        cy.getDataTest('first-name-input').type(good_input[1]['first-name']);
        cy.getDataTest('last-name-input').type(good_input[1]['last-name']);
        cy.getDataTest('username-input').type(good_input[1]['username']);
        cy.getDataTest('email-input').type(good_input[1]['email']);
        cy.getDataTest('password1-input').type(good_input[1]['password1']);
        cy.getDataTest('password2-input').type(good_input[1]['password2']);
        cy.getDataTest('submit-button').click();
        cy.location('pathname').should("eq", '/');
        cy.getDataTest('registered-message').should('contain.text',`welcome ${good_input[1]['username']}, you are now registered`)

        cy.getDataTest('nav-home').should('have.attr', 'href', '/');
        cy.getDataTest('nav-about').should('have.attr', 'href', '/about');
        cy.getDataTest('nav-contact').should('have.attr', 'href', '/contact');
        cy.getDataTest('nav-logout').should('not.exist');
        cy.getDataTest('nav-login').should('have.attr', 'href', '/users/login');
        cy.getDataTest('nav-chat').should('not.exist');

        cy.getDataTest('nav-home').should('have.class', 'active');
        cy.getDataTest('nav-about').should('not.have.class', 'active');
        cy.getDataTest('nav-contact').should('not.have.class', 'active');
    })
})