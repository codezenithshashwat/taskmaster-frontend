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
      // We add ?sort=id,desc to fetch the newest items first!
      return this.http.get(`${this.apiUrl}?sort=id,desc`);
    }

createTask(task: any): Observable<any> {
    // This is exactly like hitting POST in Postman!
    return this.http.post(this.apiUrl, task);
  }
// Update an existing task
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }

  // Delete a task by its ID
  // Delete a task by its ID
    deleteTask(id: number): Observable<any> {
      // We add responseType: 'text' because Spring Boot returns a plain string, not JSON
      return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
    }
  // Search tasks by keyword
    searchTasks(keyword: string): Observable<any> {
      // Calls http://localhost:8080/api/v1/tasks/search?keyword=yourWord
      return this.http.get(`${this.apiUrl}/search?keyword=${keyword}`);
    }
}
