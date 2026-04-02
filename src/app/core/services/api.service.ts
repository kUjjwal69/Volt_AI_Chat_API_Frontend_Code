import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ChatRequest, ChatResponse } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http
      .post<ChatResponse>(`${this.baseUrl}/api/AI/chat`, request)
      .pipe(catchError(this.handleError));
  }

  clearSession(sessionId: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/api/AI/chat/${sessionId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.status === 0) {
      errorMessage = 'Cannot connect to the server. Please check if the backend is running.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid request. Please check your input.';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
