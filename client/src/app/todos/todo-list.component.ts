import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TodoService } from './todo.service';
import { Todo } from './todo';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  /**
    * This constructor injects instance of `UserService`
    * into this component.
    * `UserService` lets us interact with the server.
    *
    * @param todoService the `UserService` used to get users from the server
    */
    constructor(private todoService: TodoService) {
      // Nothing here – everything is in the injection parameters.
    }

    todos: Signal<Todo[]> = toSignal(this.todoService.getTodos());

}
