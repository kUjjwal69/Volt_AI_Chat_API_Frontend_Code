import {
  Component, computed, ViewChild, ElementRef,
  AfterViewChecked, effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../../core/services/chat.service';
import { MessageItemComponent } from '../message-item/message-item.component';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageItemComponent],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  messages = computed(() => this.chatService.activeMessages());
  isLoading = computed(() => this.chatService.isLoading());
  error = computed(() => this.chatService.error());
  hasSession = computed(() => !!this.chatService.activeSession());

  private shouldScroll = false;

  constructor(private chatService: ChatService) {
    effect(() => {
      // Track messages changes for scrolling
      this.messages();
      this.shouldScroll = true;
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });
      }
    } catch {}
  }

  dismissError(): void {
    this.chatService.clearError();
  }

  startWithSuggestion(text: string): void {
    this.chatService.sendMessage(text);
  }
}
