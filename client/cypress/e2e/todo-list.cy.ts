import { TodoListPage } from "cypress/support/todo-list.po";

const page = new TodoListPage();

describe('Todo list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('Should show 10 todos', () => {
    page.getTodoCards().should('have.length', 300);
  });

  it('Should be able to filter by age 27 and check that it returned correct elements', () => {
    // Filter for users of age '27'
    page.filterByStatus("complete");

    page.getTodoCards().should('have.lengthOf', 150);

    // Go through each of the visible users that are being shown and get the names
    page.getTodoOwner()
      // We should see these users whose age is 27
      .should('contain.text', 'Blanche');
  });
});
