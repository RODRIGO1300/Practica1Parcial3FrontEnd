import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuild = inject(FormBuilder);

  public isLoading = false;
  public errorMessage = '';

  public loginForm = this.formBuild.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  public onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.getRawValue()).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
    ).subscribe({
      next: (response) => {
        if (!response.status) {
          this.errorMessage = response.message || 'No se pudo iniciar sesion.';
          return;
        }

        const token = response.data?.token;

        if (!token) {
          this.errorMessage = 'El servidor no regreso un token.';
          return;
        }

        this.authService.saveToken(token);
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.error('Error al iniciar sesion', error);
        this.errorMessage = 'No hubo respuesta del servidor. Revisa que el API este activo y permita CORS.';
      },
    });
  }
}
