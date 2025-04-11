import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:9094';
  constructor(private http: HttpClient) { }

  askQuestion(question: string): Observable<string> {
    const params = new HttpParams().set('question', question);
    return this.http.get(`${this.baseUrl}/`, { params, responseType: 'text' });
  }

  uploadPdfAndAskQuestion(file: File, question: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);

    return this.http.post(`${this.baseUrl}/upload`, formData, { responseType: 'text' });
  }
}
