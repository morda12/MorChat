const bad_input = require('../fixtures/test_users.json').login_bad_input;
const good_input = require('../fixtures/test_users.json').login_good_input;

describe('login', () => {
    beforeEach(() => {
        cy.visit('/users/login');
    })

    it('login page loaded', () => {
        cy.location('pathname').should("eq", '/users/login');
    })

    it('correct title', () => {
        cy.title().should('eq', 'login');
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
        cy.getDataTest('login-faile-message').should('not.exist');
    })

    it('correct header', () => {
        cy.getDataTest('login-title').should('contain.text', 'Login');
    })

    it('correct footer', () => {
        cy.getDataTest('footer-h2').should('contain.text', '***');
        cy.getDataTest('footer-p').should('exist');
    })


    bad_input.forEach(input => {
        it(input['explain'], () => {
            cy.getDataTest('login-faile-message').should('not.exist');
            cy.getDataTest('form-username-input').type(input['username']);
            cy.getDataTest('form-password-input').type(input['password']);
            cy.getDataTest('form-login-button').click();
            cy.getDataTest('login-faile-message').should('contain.text', input['error-message']);
        })
    })

    it('user login successfully', () => {
        cy.getDataTest('form-username-input').type(good_input['username']);
        cy.getDataTest('form-password-input').type(good_input['password']);
        cy.getDataTest('form-login-button').click();
        cy.getDataTest('login-faile-message').should('not.exist');
        cy.location('pathname').should("eq", '/');
        cy.getDataTest('login-message').should('contain.text', 'You are logged in')
    })

    it('disable login page for logged in user ', () => {
        cy.getDataTest('form-username-input').type(good_input['username']);
        cy.getDataTest('form-password-input').type(good_input['password']);
        cy.getDataTest('form-login-button').click();
        cy.location('pathname').should("eq", '/');
        cy.visit('/users/login');
        cy.location('pathname').should("eq", '/');
    })
})