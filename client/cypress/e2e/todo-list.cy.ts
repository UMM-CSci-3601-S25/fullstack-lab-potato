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

  it('Should be able to filter out todos based on their category', () => {

    page.filterByCategory("video games");

    page.getTodoCards().should('have.lengthOf', 71);

    page.filterByCategory("groceries");

    page.getTodoCards().should('have.lengthOf', 76);

    page.filterByCategory("homework");

    page.getTodoCards().should('have.lengthOf', 79);

    page.filterByCategory("software design");

    page.getTodoCards().should('have.lengthOf', 74);

  });

  it('Should be able to limit the number of todos returned', () => {

    page.filterByLimit(10);

    page.getTodoCards().should('have.lengthOf', 10);

  });

  it('Should be able to sort by the parameter given (alphabetically)', () => {

    page.filterByLimit(2);

    page.sortBy("category")

    page.getTodoCards().should('have.lengthOf', 2);

    page.getTodoOwners().should('contain.text', "Blanche").should('not.contain.text', "Dawn");

  });

  it('Should be able to filter out bodies by keywords', () => {
    // Filter for users of age '27'
    page.filterByBody("Nostrud");

    page.getTodoCards().should('have.lengthOf', 90);

    page.getTodoBodies().each(body => {
      cy.wrap(body).contains('div', /Nostrud|nostrud/)
    });
  });

  it('Should be able to filter out owners', () => {
    // Filter for users of age '27'
    page.filterByOwner("barry");

    page.getTodoCards().should('have.lengthOf', 51);

    page.getTodoOwners().each(owner => {
      cy.wrap(owner).should('have.text', 'Barry');
    });

    page.getTodoOwners().each(owner =>
      expect(owner.text()).to.equal('Barry')
    );
  });



});
