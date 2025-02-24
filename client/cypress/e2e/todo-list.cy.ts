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

  it('Should show 300 todos', () => {
    page.getTodoCards().should('have.length', 300);
  });

  it('Should be able to filter out complete and incomplete todos', () => {
    // Filter for users of age '27'
    page.filterByStatus("complete");

    page.getTodoCards().should('have.lengthOf', 143);

    page.filterByStatus("incomplete");

    page.getTodoCards().should('have.lengthOf', 157);

  });
});
