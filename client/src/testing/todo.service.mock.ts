import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Todo } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

/**
 * A "mock" version of the `UserService` that can be used to test components
 * without having to create an actual service. It needs to be `Injectable` since
 * that's how services are typically provided to components.
 */
@Injectable({
  providedIn: AppComponent
})
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: 'Workman_ID',
      owner: 'Workman',
      status: false,
      body: "Excepteur irure et mollit esse laboris ad tempor ullamco. Eiusmod nostrud qui veniam adipisicing aliqua voluptate reprehenderit ut amet excepteur.",
      category: "homework"
    },
    {
      _id: 'Blanche_ID',
      owner: 'Blanche',
      status: true,
      body: "Est ex commodo laboris aliquip Lorem voluptate mollit sint ex consequat. Culpa eiusmod pariatur ex veniam exercitation qui.",
      category: "groceries"
    },
    {
      _id: 'Dawn_ID',
      owner: 'Dawn',
      status: false,
      body: "Id dolor culpa quis dolore elit sunt dolore. Amet adipisicing duis aliquip deserunt ut fugiat dolore.",
      category: "software design"
    },
    {
      _id: 'Dawn_ID2',
      owner: 'Dawn',
      status: false,
      body: "I am Mrs.Potato!",
      category: "software design"
    },
    {
      _id: 'Blanche_ID2',
      owner: 'Blanche',
      status: false,
      body: "Id dolor culpa quis dolore elit sunt dolore. Amet adipisicing duis aliquip deserunt ut fugiat dolore.",
      category: "software design"
    }

  ];

  constructor() {
    super(null);
  }

  // skipcq: JS-0105
  // It's OK that the `_filters` argument isn't used here, so we'll disable
  // this warning for just his function.
  // _filters: { role?: UserRole; age?: number; company?: string }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTodos(): Observable<Todo[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test users regardless of what
    // filters are passed in.
    //
    // The `of()` function converts a regular object or value into an
    // `Observable` of that object or value.
    return of(MockTodoService.testTodos);
  }


}
