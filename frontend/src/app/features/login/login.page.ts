import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthTokenService } from '../../core/api/auth-token.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ShopService } from '../../core/shop/shop.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  standalone: true,
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
  imports: [ReactiveFormsModule, RouterLink, NgIf, TPipe]
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tokenService = inject(AuthTokenService);
  private readonly shopService = inject(ShopService);
  readonly i18n = inject(I18nService);

  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly lang = computed(() => this.i18n.lang());

  protected readonly form = this.fb.group({
    userName: ['', Validators.required],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).+$')
      ]
    ]
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.loading.set(true);
    const { userName, password } = this.form.getRawValue();

    this.auth.login({ userName: userName!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        // if token after login lacks a role claim, send user to select-role first
        const role = this.tokenService.role();
        const nextPath = this.route.snapshot.queryParamMap.get('next');
        if (!role) {
          this.router.navigate(['/select-role']);
          return;
        }

        // If the user is a seller, check their shop status and redirect to /my-shop
        if (this.tokenService.hasRole('seller')) {
          this.shopService.getMyShop().subscribe({
            next: (s) => {
              const status = (s?.status || '').toString().toLowerCase();
              if (status === 'pending' || status === 'rejected') {
                this.router.navigate(['/my-shop']);
              } else if (nextPath) {
                this.router.navigateByUrl(nextPath);
              } else {
                this.router.navigate(['/']);
              }
            },
            error: () => {
              // if no shop or error, fall back to requested next path or home
              if (nextPath) this.router.navigateByUrl(nextPath);
              else this.router.navigate(['/']);
            }
          });
          return;
        }

        // Non-seller or seller without special conditions
        if (nextPath) this.router.navigateByUrl(nextPath);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        const msg = err?.error?.message || err?.message || 'فشل تسجيل الدخول، تأكد من البيانات.';
        this.serverError.set(msg);
      }
    });
  }
}
