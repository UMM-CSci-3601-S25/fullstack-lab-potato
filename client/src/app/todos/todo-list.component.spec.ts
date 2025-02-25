import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';

describe('Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
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

  it('contains all the users', () => {
    expect(todoList.todos().length).toBe(3);
  });


});
