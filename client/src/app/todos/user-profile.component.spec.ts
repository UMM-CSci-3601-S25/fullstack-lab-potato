import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { throwError } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockTodoService } from '../../testing/Todo.service.mock';
import { Todo } from './Todo';
import { TodoCardComponent } from './todo-card.component';
import { TodoProfileComponent } from './Todo-profile.component';
import { TodoService } from './Todo.service';

describe('TodoProfileComponent', () => {
  let component: TodoProfileComponent;
  let fixture: ComponentFixture<TodoProfileComponent>;
  const mockTodoService = new MockTodoService();
  const chrisId = 'chris_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    // Using the constructor here lets us try that branch in `activated-route-stub.ts`
    // and then we can choose a new parameter map in the tests if we choose
    id: chrisId,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        MatCardModule,
        TodoProfileComponent,
        TodoCardComponent,
      ],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific Todo profile', () => {
    const expectedTodo: Todo = MockTodoService.testTodos[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `TodoProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedTodo._id });
    expect(component.Todo()).toEqual(expectedTodo);
  });

  it('should navigate to correct Todo when the id parameter changes', () => {
    let expectedTodo: Todo = MockTodoService.testTodos[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `TodoProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedTodo._id });
    expect(component.Todo()).toEqual(expectedTodo);

    // Changing the paramMap should update the displayed Todo profile.
    expectedTodo = MockTodoService.testTodos[1];
    activatedRoute.setParamMap({ id: expectedTodo._id });
    expect(component.Todo()).toEqual(expectedTodo);
  });

  it('should have `null` for the Todo for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a Todo, we expect the service
    // to return `null`, so we would expect the component's Todo
    // to also be `null`.
    expect(component.Todo()).toBeNull();
  });

  it('should set error data on observable error', () => {
    const mockError = {
      message: 'Test Error',
      error: { title: 'Error Title' },
    };

    // "Spy" on the `.addTodo()` method in the Todo service. Here we basically
    // intercept any calls to that method and return the error response
    // defined above.
    const getTodoSpy = spyOn(mockTodoService, 'getTodoById').and.returnValue(
      throwError(() => mockError)
    );

    activatedRoute.setParamMap({ id: chrisId });

    expect(component.error()).toEqual({
      help: 'There was a problem loading the Todo – try again.',
      httpResponse: mockError.message,
      message: mockError.error.title,
    });
    expect(getTodoSpy).toHaveBeenCalledWith(chrisId);
  });
});
