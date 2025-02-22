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
});
