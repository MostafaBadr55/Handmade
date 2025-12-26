import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { I18nService } from '../../core/i18n/i18n.service';
import { AuthService } from '../../core/auth/auth.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  standalone: true,
  templateUrl: './register.page.html',
  styleUrl: './register.page.css',
  imports: [ReactiveFormsModule, RouterLink, NgIf, TPipe]
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly lang = computed(() => this.i18n.lang());
  protected readonly successMessage = signal<string | null>(null);

  protected readonly form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(7), Validators.maxLength(15)]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).+$')
      ]
    ],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordsMatch });

  private passwordsMatch(group: any) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.loading.set(true);
    const val = this.form.getRawValue();

    // normalize email: trim whitespace and lowercase before sending
    const normalizedEmail = val.email ? String(val.email).trim().toLowerCase() : val.email;
    // update form control (no event emit) so UI reflects normalized value
    this.form.get('email')?.setValue(normalizedEmail, { emitEvent: false });

    this.auth.register({
      userName: val.userName!,
      email: normalizedEmail!,
      phoneNumber: val.phoneNumber!,
      password: val.password!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        // show inline success message in current language
        const msg = this.lang() === 'ar' ? 'تم التسجيل بنجاح! يرجى تسجيل الدخول.' : 'Registration successful! Please login.';
        this.successMessage.set(msg);
        this.serverError.set(null);
        // auto-redirect to login after 1.6s
        setTimeout(() => this.router.navigate(['/login']), 1600);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        const msg = err?.error?.message || err?.message || 'فشل التسجيل، تأكد من البيانات.';
        this.serverError.set(msg);
      }
    });
  }
}
