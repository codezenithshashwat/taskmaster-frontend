import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1️⃣ ADD THIS IMPORT
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // 2️⃣ ADD FormsModule HERE
  templateUrl: './task-list.html'
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  // 3️⃣ Variables to hold what the user types in the form
  newTaskTitle: string = '';
  newTaskDescription: string = '';
// Variable to hold the search text
  searchQuery: string = '';

  // The Live Search function
  onSearch() {
    // If the box is empty, just load all normal tasks again
    if (this.searchQuery.trim() === '') {
      this.loadTasks();
      return;
    }

    // Otherwise, ask Java for the filtered list
    this.taskService.searchTasks(this.searchQuery).subscribe({
      next: (response) => {
        // Depending on your Java code, it might return a Page (.content) or a raw List.
        // This line safely handles both!
        this.tasks = response.content ? response.content : response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error searching tasks:', err)
    });
  }
  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      (response) => {
        this.tasks = response.content;
        this.cdr.detectChanges();
      },
      (error) => console.error('Error fetching tasks:', error)
    );
  }

  // 4️⃣ The function that runs when you click "Add Task"
  addTask() {
    // Don't save if the title is empty
    if (!this.newTaskTitle.trim()) return;

    // Create the JSON object to send to Java
    const newTask = {
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      completed: false
    };

    // Send it!
    this.taskService.createTask(newTask).subscribe({
      next: (response) => {
        console.log('Task saved to database!', response);
        // Clear the input boxes
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        // Refresh the list to show the new task
        this.loadTasks();
      },
      error: (err) => console.error('Error creating task:', err)
    });
  }

// Toggle the Completed status
  // Toggle the Completed status
    toggleComplete(task: any) {
      // Pack strictly what the Java TaskRequest record is expecting
      const updatePayload = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate || null, // Include dueDate just in case Java demands it
        completed: !task.completed   // Flip the status
      };

      // Send only the neat payload to Java
      this.taskService.updateTask(task.id, updatePayload).subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Error updating task:', err)
      });
    }

  // Delete the task
  deleteTask(id: number) {
    // Browser popup to confirm
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => this.loadTasks(), // Refresh list on success
        error: (err) => console.error('Error deleting task:', err)
      });
    }
  }
}
