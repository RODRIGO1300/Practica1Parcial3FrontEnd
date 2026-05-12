import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuild = inject(FormBuilder);

  public isLoading = false;
  public errorMessage = '';

  public registerForm = this.formBuild.nonNullable.group({
    nombre: ['', Validators.required],
    apellidoP: ['', Validators.required],
    apellidoM: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  public onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const {
      nombre,
      apellidoP,
      apellidoM,
      username,
      password,
      confirmPassword,
    } = this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      this.errorMessage = 'Las contrasenas no coinciden.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      nombre,
      apellidoP,
      apellidoM,
      username,
      password,
    }).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
    ).subscribe({
      next: (response) => {
        if (!response.status) {
          this.errorMessage = response.message || 'No se pudo registrar el usuario.';
          return;
        }

        this.router.navigateByUrl('/auth/login');
      },
      error: (error) => {
        console.error('Error al registrar usuario', error);
        this.errorMessage = 'No hubo respuesta del servidor. Revisa que el API este activo.';
      },
    });
  }
}
