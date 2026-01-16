import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task'; // Points to your service file

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  // Notice these names match YOUR files exactly:
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskListComponent implements OnInit {

  tasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef // <--- Inject it here
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      (response) => {
        this.tasks = response.content;
        console.log('Tasks loaded:', this.tasks);

        // FORCE UPDATE: Tell Angular "The data changed, repaint the screen now!"
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }
}
