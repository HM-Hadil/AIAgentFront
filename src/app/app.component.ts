import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './services/chat.service';
import { FormsModule } from '@angular/forms';
interface Message {
  text: string;
  sent: boolean; // true si envoyé par l'utilisateur, false si reçu
  timestamp: Date;
  isFile?: boolean;
  fileName?: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}