import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Todo } from './todo';

const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  BrowserAnimationsModule,
  RouterModule.forRoot([]),
];

describe('Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, TodoListComponent],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    todoList = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(todoList).toBeTruthy();
  });

  it('contains all the todos', () => {
    expect(todoList.serverFilteredTodos().length).toBe(5);
  });

  });
  describe('Misbehaving Todo List', () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoServiceStub: {
      getTodos: () => Observable<Todo[]>;
      filterTodos: () => Todo[];
    };

    beforeEach(() => {
      // stub TodoService for test purposes
      todoServiceStub = {
        getTodos: () =>
          new Observable((observer) => {
            observer.error('getTodos() Observer generates an error');
          }),
        filterTodos: () => []
      };

      TestBed.configureTestingModule({
        imports: [COMMON_IMPORTS, TodoListComponent],
        // providers:    [ TodoService ]  // NO! Don't provide the real service!
        // Provide a test-double instead
        providers: [{ provide: TodoService, useValue: todoServiceStub }],
      });
    });

    // Construct the `todoList` used for the testing in the `it` statement
    // below.
    beforeEach(waitForAsync(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(TodoListComponent);
        todoList = fixture.componentInstance;
        fixture.detectChanges();
      });
    }));

    it("generates an error if we don't set up a TodoListService", () => {
      // If the service fails, we expect the `serverFilteredTodos` signal to
      // be an empty array of todos.
      expect(todoList.serverFilteredTodos())
        .withContext("service can't give values to the list if it's not there")
        .toEqual([]);
      // We also expect the `errMsg` signal to contain the "Problem contacting…"
      // error message. (It's arguably a bit fragile to expect something specific
      // like this; maybe we just want to expect it to be non-empty?)
      expect(todoList.errMsg())
        .withContext('the error message will be')
        .toContain('Problem contacting the server – Error Code:');
  })
});
