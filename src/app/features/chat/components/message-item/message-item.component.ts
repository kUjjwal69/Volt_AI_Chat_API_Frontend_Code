import { Component, input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../core/models/message.model';

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent {
  message = input.required<Message>();

  get isUser(): boolean {
    return this.message().role === 'user';
  }

  get formattedTime(): string {
    return new Date(this.message().timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatContent(content: string): string {
    if (!content) return '';
    // Basic markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
}
