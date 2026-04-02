import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChatService } from '../../../core/services/chat.service';
import { ChatSession } from '../../../core/models/message.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  theme = input<'light' | 'dark'>('light');
  closeSidebar = output<void>();
  setTheme = output<'light' | 'dark'>();

  sessions = computed(() => this.chatService.sessions());
  activeSessionId = computed(() => this.chatService.activeSessionId());

  constructor(public chatService: ChatService) {}

  newChat(): void {
    this.chatService.createNewSession();
    this.closeSidebar.emit();
  }

  selectSession(session: ChatSession): void {
    this.chatService.selectSession(session.sessionId);
    this.closeSidebar.emit();
  }

  deleteSession(event: Event, sessionId: string): void {
    event.stopPropagation();
    this.chatService.deleteSession(sessionId);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  }
}
