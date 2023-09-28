describe('contact page as visitor', () => {
  beforeEach(()=>{
    cy.visit('/contact');
  })

    it('contact page loaded', () => {
      cy.location('pathname').should("eq", '/contact');
    })
  
    it('correct title', () => {
      cy.title().should('eq', 'contact');
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
      cy.getDataTest('nav-contact').should('have.class', 'active');
    })
  
  
    it('registered message not exist', () => {
      cy.getDataTest('registered-message').should('not.exist');
    })
  
    it('login message not exist', () => {
      cy.getDataTest('login-message').should('not.exist');
    })
  
    it('correct header', () => {
      cy.getDataTest('welcome-title').should('contain.text', 'Welcome');
      cy.getDataTest('welcome-here-page').should('contain.text', 'Here is the contact page');
    })
  
    it('correct body', () => {
      cy.getDataTest('section-title').should('contain.text', 'Here is the body');
      cy.getDataTest('section-p').should('contain.text', 'Lorem ipsum dolor sit');
    })
  
    it('correct footer', () => {
      cy.getDataTest('footer-h2').should('contain.text', '***');
      cy.getDataTest('footer-p').should('exist');
    })
  })