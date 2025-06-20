import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  showAlert: boolean = false;
  returnUrl: string = '/chat'; // URL de retour après connexion

  constructor(
    private fb: FormBuilder,
    private authService: AuthserviceService,
    private router: Router,
    private route: ActivatedRoute // Ajouté pour gérer l'URL de retour
  ) {
    // Initialize the form with FormBuilder
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Récupérer l'URL de retour depuis les paramètres de requête
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/chat';
    this.checkAuthStatus();
  }

  async checkAuthStatus(): Promise<void> {
    try {
      const isAuthenticated = await this.authService.checkAuthStatus();
      if (isAuthenticated) {
        // Rediriger vers l'URL de retour ou vers chat par défaut
        this.router.navigate([this.returnUrl]);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      this.showAlertMessage('error', 'Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    this.hideAlert();

    const { username, password } = this.loginForm.value;

    try {
      const response = await this.authService.login(username, password);
      
      if (response.success) {
        this.showAlertMessage('success', 'Login successful!');
        setTimeout(() => {
          // Rediriger vers l'URL de retour au lieu de hardcoder /chat
          this.router.navigate([this.returnUrl]);
        }, 1000);
      } else {
        this.showAlertMessage('error', response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showAlertMessage('error', 'Connection error. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  fillTestCredentials(username: string, password: string): void {
    this.loginForm.patchValue({
      username: username,
      password: password
    });
    this.hideAlert();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private showAlertMessage(type: 'success' | 'error', message: string): void {
    this.alertType = type;
    this.alertMessage = message;
    this.showAlert = true;
  }

  private hideAlert(): void {
    this.showAlert = false;
  }

  // Getter methods for easy access to form controls in template
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}