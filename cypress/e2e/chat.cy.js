const users = require('../fixtures/test_users.json').chat_test_users;

const user1 = users[0];
const user2 = users[1];
const user3 = users[2];

const helloMsg=(user) => `Hello ${user.username}!`;
const helloAgainMsg=(user) => `Hello again ${user.username}!`;
describe('create users for the test', () => {

  it('create users for the test', () =>{
    cy.visit('/users/register');
    cy.createUser(user1);
    cy.visit('/users/register');
    cy.createUser(user2);
    cy.visit('/users/register');
    cy.createUser(user3);
  })
})


describe('chat', () => {
 
  beforeEach(()=>{
    cy.visit('/users/login');
    cy.getDataTest('form-username-input').type(user1.username);
    cy.getDataTest('form-password-input').type(user1.password);
    cy.getDataTest('form-login-button').click();
    cy.visit('/chat');
  })

  it('chat page loaded', () => {
    cy.location('pathname').should("eq", '/chat');
  })

  it('correct title', () => {
    cy.title().should('eq', 'chat');
  })

  it('correct logo', () => {
    cy.getDataTest('navbar-logo').should('contain.text', 'MorChat');
  })
  
  it('correct nav bottun', () => {
    cy.getDataTest('nav-home').should('have.attr', 'href', '/');
    cy.getDataTest('nav-about').should('have.attr', 'href', '/about');
    cy.getDataTest('nav-contact').should('have.attr', 'href', '/contact');
    cy.getDataTest('nav-login').should('not.exist');
    cy.getDataTest('nav-logout').should('have.attr', 'href', '/users/logout');
    cy.getDataTest('nav-chat').should('have.attr', 'href', '/chat');
  })

  it('correct active nav', () => {
    cy.getDataTest('nav-home').should('not.have.class', 'active');
    cy.getDataTest('nav-about').should('not.have.class', 'active');
    cy.getDataTest('nav-contact').should('not.have.class', 'active');
    cy.getDataTest('nav-chat').should('have.class', 'active');
  })
  
  it('registered message not exist', () => {
    cy.getDataTest('registered-message').should('not.exist');
  })

  it('login message not exist', () => {
    cy.getDataTest('login-message').should('not.exist');
  })

  it('username above conversation list', () =>{
    cy.getDataTest('conv-bar-username').should('contain.text', user1.username);
  })

  it('empty conversation list', () =>{
    cy.getDataTest('conv-list').children().should('not.exist');
  })

  it('no conversation selected', () =>{
    cy.getDataTest('current-conv-friend').should('contain.text','Please select who you would like to chat with');
  })

  it('add new conversation, user1 and user2', () =>{
    cy.getDataTest('new-friend-input').type(user2.username);
    cy.getDataTest('new-friend-button').click();
    cy.getDataTest('conv-list').children().should('have.length', 1);
    cy.getDataTest('conv-0').should('contain.text', user2.username);
  })

  it('add new conversation, user1 and user3', () =>{
    cy.getDataTest('conv-0').should('contain.text',user2.username);
    cy.getDataTest('new-friend-input').type(user3.username);
    cy.getDataTest('new-friend-button').click();
    cy.getDataTest('conv-list').children().should('have.length', 2);
    cy.getDataTest('conv-0').should('contain.text', user3.username);
    cy.getDataTest('conv-1').should('contain.text', user2.username);
  })

  it('send message from user1 to user2', () =>{
    cy.getDataTest('conv-0').should('contain.text',user3.username);
    cy.getDataTest('conv-1').should('contain.text',user2.username).click();
    cy.getDataTest('new-msg-input').type(helloMsg(user2));
    cy.getDataTest('new-msg-button').click();
    cy.getDataTest('writer 0').invoke('text').then((text) => { expect(text.trim()).equal(user1.username)});
    cy.getDataTest('message 0').invoke('text').then((text) => { expect(text.trim()).equal(helloMsg(user2))});
  })

  it('send message from user1 to user3', () =>{
    cy.getDataTest('conv-0').should('contain.text',user2.username);
    cy.getDataTest('conv-1').should('contain.text',user3.username).click();
    cy.getDataTest('new-msg-input').type(helloMsg(user3));
    cy.getDataTest('new-msg-button').click();
    cy.getDataTest('writer 0').invoke('text').then((text) => { expect(text.trim()).equal(user1.username)});
    cy.getDataTest('message 0').invoke('text').then((text) => { expect(text.trim()).equal(helloMsg(user3))});
  })

  it('send message from user1 to user2 (again)', () =>{
    cy.getDataTest('conv-0').should('contain.text',user3.username);
    cy.getDataTest('conv-1').should('contain.text',user2.username).click();
    cy.getDataTest('new-msg-input').type(helloAgainMsg(user2));
    cy.getDataTest('new-msg-button').click();
    cy.getDataTest('writer 0').invoke('text').then((text) => { expect(text.trim()).equal(user1.username)});
    cy.getDataTest('message 0').invoke('text').then((text) => { expect(text.trim()).equal(helloMsg(user2))});
    cy.getDataTest('writer 1').invoke('text').then((text) => { expect(text.trim()).equal(user1.username)});
    cy.getDataTest('message 1').invoke('text').then((text) => { expect(text.trim()).equal(helloAgainMsg(user2))});
  })

})