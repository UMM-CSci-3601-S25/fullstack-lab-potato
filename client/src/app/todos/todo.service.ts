import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Todo } from './todo';

/**
 * Service that provides the interface for getting information
 * about `Todos` from the server.
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // The URL for the users part of the server API.
  readonly todoUrl: string = `${environment.apiUrl}todos`;
  private readonly statusKey = 'status';

  // The private `HttpClient` is *injected* into the service
  // by the Angular framework. This allows the system to create
  // only one `HttpClient` and share that across all services
  // that need it, and it allows us to inject a mock version
  // of `HttpClient` in the unit tests so they don't have to
  // make "real" HTTP calls to a server that might not exist or
  // might not be currently running.
  constructor(private httpClient: HttpClient) {
  }

/**
  * Get all the users from the server, filtered by the information
  * in the `filters` map.
  *
  *
  * @param filters a map that allows us to specify a target role, age,
  *  or company to filter by, or any combination of those
  * @returns an `Observable` of an array of `Todos`. Wrapping the array
  *  in an `Observable` means that other bits of of code can `subscribe` to
  *  the result (the `Observable`) and get the results that come back
  *  from the server after a possibly substantial delay (because we're
  *  contacting a remote server over the Internet).
  */
  getTodos(filters?: {status: string}): Observable<Todo[]> {
    // `HttpParams` is essentially just a map used to hold key-value
    // pairs that are then encoded as "?key1=value1&key2=value2&…" in
    // the URL when we make the call to `.get()` below.
    let httpParams: HttpParams = new HttpParams();
    // Send the HTTP GET request with the given URL and parameters.
    // That will return the desired `Observable<Todo[]>`.
    if (filters) {
      if (filters.status) {
        httpParams = httpParams.set(this.statusKey, filters.status.toString());
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterTodos(todos: Todo[], filters: { owner?: string; category?: string }): Todo[] { // skipcq: JS-0105
    const filteredTodos = todos;
    return filteredTodos;
  }
}
