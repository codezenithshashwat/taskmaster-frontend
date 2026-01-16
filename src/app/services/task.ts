import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // 1. Point to your Spring Boot API
  private apiUrl = 'http://localhost:8080/api/v1/tasks';

  // 2. Inject the HTTP Client
  constructor(private http: HttpClient) { }

  // 3. Method to fetch data
  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
