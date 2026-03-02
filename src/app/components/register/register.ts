import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .register({
        username: this.username,
        password: this.password,
        email: this.email,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        },
      });
  }
}
