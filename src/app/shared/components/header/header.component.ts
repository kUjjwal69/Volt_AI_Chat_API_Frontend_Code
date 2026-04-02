import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  sidebarOpen = input<boolean>(false);
  toggleSidebar = output<void>();

  activeSession = computed(() => this.chatService.activeSession());

  constructor(private chatService: ChatService) {}
}
