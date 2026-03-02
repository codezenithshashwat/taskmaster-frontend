import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task, TaskRequest, Priority, TaskStatusType } from '../../services/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority = 'MEDIUM';
  newTaskDueDate = '';
  searchQuery = '';
  activeFilter = 'ALL';

  priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  statusFilters = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'];

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response.content ? response.content : response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching tasks:', err),
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;

    const newTask: TaskRequest = {
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      completed: false,
      priority: this.newTaskPriority,
      status: 'PENDING',
      dueDate: this.newTaskDueDate ? new Date(this.newTaskDueDate).toISOString().slice(0, 19) : null,
    };

    this.taskService.createTask(newTask).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskPriority = 'MEDIUM';
        this.newTaskDueDate = '';
        this.loadTasks();
      },
      error: (err) => console.error('Error creating task:', err),
    });
  }

  toggleComplete(task: Task): void {
    const updatePayload: TaskRequest = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: !task.completed,
      priority: task.priority,
      status: !task.completed ? 'COMPLETED' : 'PENDING',
    };

    this.taskService.updateTask(task.id, updatePayload).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Error updating task:', err),
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Error deleting task:', err),
      });
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.loadTasks();
      return;
    }

    this.taskService.searchTasks(this.searchQuery).subscribe({
      next: (response) => {
        this.tasks = response.content ? response.content : response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error searching tasks:', err),
    });
  }

  filterByStatus(status: string): void {
    this.activeFilter = status;
    if (status === 'ALL') {
      this.loadTasks();
      return;
    }

    this.taskService.getTasksByStatus(status as TaskStatusType).subscribe({
      next: (response) => {
        this.tasks = response.content ? response.content : response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error filtering tasks:', err),
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'URGENT':
        return 'bg-danger';
      case 'HIGH':
        return 'bg-warning text-dark';
      case 'MEDIUM':
        return 'bg-info text-dark';
      case 'LOW':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'bg-success';
      case 'OVERDUE':
        return 'bg-danger';
      case 'IN_PROGRESS':
        return 'bg-primary';
      case 'PENDING':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  }

  isOverdue(task: Task): boolean {
    return task.status === 'OVERDUE';
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
