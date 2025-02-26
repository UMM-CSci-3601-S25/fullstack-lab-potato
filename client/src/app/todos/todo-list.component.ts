import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { MatFormField, MatHint, MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from './todo.service';
import { Todo } from './todo';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-todo-list',
  imports: [
    MatFormField,
    MatHint,
    MatInputModule,
    FormsModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  todoStatus = signal<string | undefined>(undefined);
  todoOwner = signal<string | undefined>(undefined);
  todoBody = signal<string | undefined>(undefined);
  todoCategory = signal<string | undefined>(undefined);

  errMsg = signal<string | undefined>(undefined);
  /**
    * This constructor injects instance of `TodoService`
    * into this component.
    * `TodoService` lets us interact with the server.
    *
    * @param todoService the `TodoService` used to get todos from the server
    */
    constructor(private todoService: TodoService, private snackBar: MatSnackBar) {
      // Nothing here – everything is in the injection parameters.
    }
    private todoStatus$ = toObservable(this.todoStatus);
    private todoCategory$ = toObservable(this.todoCategory);

    // We ultimately `toSignal` this to be able to access it synchronously, but we do all the RXJS operations
    // "inside" the `toSignal()` call processing and transforming the observables there.
    serverFilteredTodos =
      // This `combineLatest` call takes the most recent values from these two observables (both built from
      // signals as described above) and passes them into the following `.pipe()` call. If either of the
      // `todoRole` or `todoAge` signals change (because their text fields get updated), then that will trigger
      // the corresponding `todoRole$` and/or `todoAge$` observables to change, which will cause `combineLatest()`
      // to send a new pair down the pipe.
      toSignal(
        combineLatest([this.todoStatus$, this.todoCategory$]).pipe(
          // `switchMap` maps from one observable to another. In this case, we're taking `role` and `status` and passing
          // them as arguments to `todoService.getTodos()`, which then returns a new observable that contains the
          // results.
          switchMap(([ status, category ]) =>
            this.todoService.getTodos({
              status, category
            })
          ),
          // `catchError` is used to handle errors that might occur in the pipeline. In this case `todoService.getTodos()`
          // can return errors if, for example, the server is down or returns an error. This catches those errors, and
          // sets the `errMsg` signal, which allows error messages to be displayed.
          catchError((err) => {
            if (!(err.error instanceof ErrorEvent)) {
              this.errMsg.set(
                `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`
              );
            }
            this.snackBar.open(this.errMsg(), 'OK', { duration: 6000 });
            // `catchError` needs to return the same type. `of` makes an observable of the same type, and makes the array still empty
            return of<Todo[]>([]);
          }),
          // Tap allows you to perform side effects if necessary
          tap(() => {
            // A common side effect is printing to the console.
            // You don't want to leave code like this in the
            // production system, but it can be useful in debugging.
            // console.log('Todos were filtered on the server')
          })
        )
      );

    // No need for fancy RXJS stuff. We do the fancy RXJS stuff where we call `toSignal`, i.e., up in
    // the definition of `serverFilteredTodos` above.
    // `computed()` takes the value of one or more signals (`serverFilteredTodos` in this case) and
    // _computes_ the value of a new signal (`filteredTodos`). Angular recognizes when any signals
    // in the function passed to `computed()` change, and will then call that function to generate
    // the new value of the computed signal.
    // In this case, whenever `serverFilteredTodos` changes (e.g., because we change `todoName`), then `filteredTodos`
    // will be updated by rerunning the function we're passing to `computed()`.
    filteredTodos = computed(() => {
      const serverFilteredTodos = this.serverFilteredTodos();
      return this.todoService.filterTodos(serverFilteredTodos,
        {owner: this.todoOwner(), body: this.todoBody(),});
    });
  }
