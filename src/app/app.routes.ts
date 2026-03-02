import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { TaskListComponent } from './components/task-list/task-list';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [authGuard] },
];
