import { AddTodoPage } from '../support/add-todo.po';

describe('Add todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable the add todo button', () => {
    // ADD USER button should be disabled until all the necessary fields
    // are filled. Once the last (`#emailField`) is filled, then the button should
    // become enabled.
    page.addTodoButton().should('be.disabled');
    page.getFormField('owner').type('test');
    page.addTodoButton().should('be.disabled');
    page.getFormField('body').type('test');
    page.addTodoButton().should('be.disabled');
    page.getFormField('category').click().then(() => {
      return cy.get(`[value="video games"]`).click();
    })
    page.addTodoButton().should('be.disabled');
    page.getFormField('status').click().then(() => {
      return cy.get(`[value=false]`).click();
    })
    // all the required fields have valid input, then it should be enabled
    page.addTodoButton().should('be.enabled');
  });

  it('Should show error messages for invalid inputs', () => {
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=ownerError]').should('not.exist');
    // Just clicking the name field without entering anything should cause an error message
    page.getFormField('owner').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    // Some more tests for various invalid name inputs
    page.getFormField('owner').type('a').blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    page
      .getFormField('owner')
      .clear()
      .type('Is there an end or a beginning to anything? Am I here? Are you here? Is the tree in front of us here? If I touch it, absorb its lush green leaves, run my hand across its rough bark, and fall into its branches, could you even remember that my feelings once existed?')
      .blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    // Entering a valid name should remove the error.
    page.getFormField('owner').clear().type('John Smith').blur();
    cy.get('[data-test=ownerError]').should('not.exist');

    //BODY TESTS
    cy.get('[data-test=bodyError]').should('not.exist');
    // Just clicking the name field without entering anything should cause an error message
    page.getFormField('body').click().blur();
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');
    // Entering a valid name should remove the error.
    page.getFormField('body').clear().type('Is there an end or a beginning to anything? Am I here? Are you here? Is the tree in front of us here? If I touch it, absorb its lush green leaves, run my hand across its rough bark, and fall into its branches, could you even remember that my feelings once existed?').blur();
    cy.get('[data-test=bodyError]').should('not.exist');



});
})
