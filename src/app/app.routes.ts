import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/chat/components/chat-container/chat-container.component')
        .then(m => m.ChatContainerComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/auth-page/auth-page.component')
        .then(m => m.AuthPageComponent),
    data: { mode: 'login' }
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/components/auth-page/auth-page.component')
        .then(m => m.AuthPageComponent),
    data: { mode: 'register' }
  },
  { path: '**', redirectTo: '' }
];
