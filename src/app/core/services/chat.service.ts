import { Injectable, signal, computed } from '@angular/core';
import { Message, ChatSession } from '../models/message.model';
import { ApiService } from './api.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _sessions = signal<ChatSession[]>([]);
  private _activeSessionId = signal<string | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  sessions = computed(() => this._sessions());
  activeSessionId = computed(() => this._activeSessionId());
  isLoading = computed(() => this._isLoading());
  error = computed(() => this._error());

  activeSession = computed(() =>
    this._sessions().find(s => s.sessionId === this._activeSessionId()) ?? null
  );

  activeMessages = computed(() => this.activeSession()?.messages ?? []);

  constructor(private api: ApiService) {
    this.loadSessionsFromStorage();
  }
  

  createNewSession(): ChatSession {
    const session: ChatSession = {
      sessionId: uuidv4(),
      title: 'New Chat',
      createdAt: new Date(),
      messages: []
    };
    this._sessions.update(sessions => [session, ...sessions]);
    this._activeSessionId.set(session.sessionId);
    this._error.set(null);
    this.saveSessionsToStorage();
    return session;
  }

  selectSession(sessionId: string): void {
    this._activeSessionId.set(sessionId);
    this._error.set(null);
  }

  async sendMessage(content: string): Promise<void> {
    if (!content.trim() || this._isLoading()) return;

    let sessionId = this._activeSessionId();
    if (!sessionId) {
      const session = this.createNewSession();
      sessionId = session.sessionId;
    }

    const userMessage: Message = {
      id: uuidv4(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    this.addMessage(sessionId, userMessage);
    this._isLoading.set(true);
    this._error.set(null);

    // Update session title from first message
    const session = this._sessions().find(s => s.sessionId === sessionId);
    if (session && session.messages.length === 1) {
      this.updateSessionTitle(sessionId, content.trim());
    }

    // Placeholder streaming message
    const assistantMessage: Message = {
      id: uuidv4(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true
    };
    this.addMessage(sessionId!, assistantMessage);

    this.api.sendMessage({ sessionId: sessionId!, userMessage: content.trim() }).subscribe({
      next: (response) => {
        this._isLoading.set(false);
        this.updateStreamingMessage(sessionId!, assistantMessage.id, response.reply);
        this.saveSessionsToStorage();
      },
      error: (err) => {
        this._isLoading.set(false);
        this.removeMessage(sessionId!, assistantMessage.id);
        this._error.set(err.message);
        this.saveSessionsToStorage();
      }
    });
  }

  deleteSession(sessionId: string): void {
    this.api.clearSession(sessionId).subscribe();
    this._sessions.update(sessions => sessions.filter(s => s.sessionId !== sessionId));
    if (this._activeSessionId() === sessionId) {
      const remaining = this._sessions();
      this._activeSessionId.set(remaining.length > 0 ? remaining[0].sessionId : null);
    }
    this.saveSessionsToStorage();
  }

  clearError(): void {
    this._error.set(null);
  }

  private addMessage(sessionId: string, message: Message): void {
    this._sessions.update(sessions =>
      sessions.map(s =>
        s.sessionId === sessionId
          ? { ...s, messages: [...s.messages, message] }
          : s
      )
    );
  }

  private removeMessage(sessionId: string, messageId: string): void {
    this._sessions.update(sessions =>
      sessions.map(s =>
        s.sessionId === sessionId
          ? { ...s, messages: s.messages.filter(m => m.id !== messageId) }
          : s
      )
    );
  }

  private updateStreamingMessage(sessionId: string, messageId: string, fullContent: string): void {
    const chars = fullContent.split('');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= chars.length) {
        clearInterval(interval);
        this._sessions.update(sessions =>
          sessions.map(s =>
            s.sessionId === sessionId
              ? {
                  ...s,
                  messages: s.messages.map(m =>
                    m.id === messageId ? { ...m, isStreaming: false } : m
                  )
                }
              : s
          )
        );
        return;
      }
      const chunkSize = Math.min(3, chars.length - idx);
      const chunk = chars.slice(idx, idx + chunkSize).join('');
      idx += chunkSize;
      this._sessions.update(sessions =>
        sessions.map(s =>
          s.sessionId === sessionId
            ? {
                ...s,
                messages: s.messages.map(m =>
                  m.id === messageId ? { ...m, content: m.content + chunk } : m
                )
              }
            : s
        )
      );
    }, 18);
  }

  private updateSessionTitle(sessionId: string, firstMessage: string): void {
    const title = firstMessage.length > 40
      ? firstMessage.substring(0, 40) + '...'
      : firstMessage;
    this._sessions.update(sessions =>
      sessions.map(s => s.sessionId === sessionId ? { ...s, title } : s)
    );
  }

  private saveSessionsToStorage(): void {
    try {
      const data = this._sessions().map(s => ({
        ...s,
        messages: s.messages.filter(m => !m.isStreaming)
      }));
      localStorage.setItem('chat_sessions', JSON.stringify(data));
    } catch {}
  }

  private loadSessionsFromStorage(): void {
    try {
      const raw = localStorage.getItem('chat_sessions');
      if (raw) {
        const sessions: ChatSession[] = JSON.parse(raw);
        sessions.forEach(s => {
          s.createdAt = new Date(s.createdAt);
          s.messages.forEach(m => m.timestamp = new Date(m.timestamp));
        });
        this._sessions.set(sessions);
        if (sessions.length > 0) {
          this._activeSessionId.set(sessions[0].sessionId);
        }
      }
    } catch {}
  }
}
