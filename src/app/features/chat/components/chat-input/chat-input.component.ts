import {
  Component, computed, ViewChild, ElementRef,
  AfterViewInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements AfterViewInit {
  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  message = '';
  selectedFiles: File[] = [];
  isLoading = computed(() => this.chatService.isLoading());

  constructor(private chatService: ChatService) {}

  ngAfterViewInit(): void {
    this.textareaRef?.nativeElement?.focus();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  onInput(): void {
    const el = this.textareaRef?.nativeElement;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 180) + 'px';
    }
  }

  openFilePicker(): void {
    if (this.isLoading()) return;
    this.fileInputRef?.nativeElement?.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;

    const existing = new Set(
      this.selectedFiles.map(file => `${file.name}-${file.size}-${file.lastModified}`)
    );

    const nextFiles = files.filter(
      file => !existing.has(`${file.name}-${file.size}-${file.lastModified}`)
    );

    this.selectedFiles = [...this.selectedFiles, ...nextFiles];
    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles = this.selectedFiles.filter((_, fileIndex) => fileIndex !== index);
  }

  formatFileSize(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  send(): void {
    const msg = this.message.trim();
    if (!msg || this.isLoading()) return;
    this.chatService.sendMessage(msg);
    this.message = '';
    this.selectedFiles = [];
    setTimeout(() => {
      const el = this.textareaRef?.nativeElement;
      if (el) {
        el.style.height = 'auto';
        el.focus();
      }
    });
  }

  get canSend(): boolean {
    return this.message.trim().length > 0 && !this.isLoading();
  }
}
