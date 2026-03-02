import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatusType = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  status: TaskStatusType;
  dueDate: string | null;
  createdAt: string;
}

export interface TaskRequest {
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  priority: string | null;
  status: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}?sort=id,desc`);
  }

  createTask(task: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  searchTasks(keyword: string): Observable<any> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getTasksByStatus(status: TaskStatusType): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${encodeURIComponent(status)}`);
  }

  getTasksByPriority(priority: Priority): Observable<any> {
    return this.http.get(`${this.apiUrl}/priority/${encodeURIComponent(priority)}`);
  }
}
