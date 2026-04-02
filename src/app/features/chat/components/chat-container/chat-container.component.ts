import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    MessageListComponent,
    ChatInputComponent
  ],
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent {
  sidebarOpen = signal(false);
  theme = signal<'light' | 'dark'>(this.getInitialTheme());

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeSidebar();
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.theme.set(theme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  private getInitialTheme(): 'light' | 'dark' {
    const storedTheme = typeof localStorage !== 'undefined'
      ? localStorage.getItem('theme')
      : null;
    const theme = storedTheme === 'dark' ? 'dark' : 'light';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    return theme;
  }
}
