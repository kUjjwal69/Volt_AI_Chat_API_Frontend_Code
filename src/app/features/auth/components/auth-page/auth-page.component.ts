import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {
  mode = input<'login' | 'register'>('login');

  title = computed(() => this.mode() === 'login' ? 'Welcome back' : 'Create your account');
  subtitle = computed(() =>
    this.mode() === 'login'
      ? 'Sign in to continue your conversations and saved sessions.'
      : 'Register to save chats, themes, and upcoming file workflows.'
  );
  submitLabel = computed(() => this.mode() === 'login' ? 'Login' : 'Register');
  alternateText = computed(() =>
    this.mode() === 'login'
      ? 'Need an account?'
      : 'Already have an account?'
  );
  alternateLabel = computed(() => this.mode() === 'login' ? 'Register' : 'Login');
  alternateRoute = computed(() => this.mode() === 'login' ? '/register' : '/login');
}
