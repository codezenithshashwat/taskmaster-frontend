import { Component } from '@angular/core';
import { TaskListComponent } from './components/task-list/task-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListComponent], // <--- Removed RouterOutlet from here
  templateUrl: './app.html'
})
export class AppComponent {
  title = 'taskmaster-frontend';
}
