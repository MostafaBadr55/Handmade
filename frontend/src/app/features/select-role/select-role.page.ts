import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { AuthTokenService } from '../../core/api/auth-token.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  standalone: true,
  templateUrl: './select-role.page.html',
  styleUrl: './select-role.page.css',
  imports: [RouterLink, NgIf, TPipe]
})
export class SelectRolePage {
  private readonly auth = inject(AuthService);
  private readonly tokenService = inject(AuthTokenService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly lang = computed(() => this.i18n.lang());

  protected selectBuyer(): void {
    this.performSelection(1);
  }

  protected selectSeller(): void {
    this.performSelection(2);
  }

  private performSelection(role: number): void {
    this.serverError.set(null);
    this.loading.set(true);
    this.auth.selectRole({ role }).subscribe({
      next: (res) => {
        this.loading.set(false);
        const msg = this.lang() === 'ar'
          ? (role === 2 ? 'تم اختيار دور البائع. يرجى تسجيل الدخول مرة أخرى لإنهاء الإعداد.' : 'تم اختيار دور المشتري.')
          : (role === 2 ? 'Seller role selected. Please login again to finish setup.' : 'Buyer role selected.');
        this.successMessage.set(msg);

        if (role === 2) {
          // clear current token so user can re-login and receive updated token
          this.tokenService.setToken(null);
          this.tokenService.setUserName(null);
          // navigate to login and request redirect to create-shop after login
          setTimeout(() => this.router.navigate(['/login'], { queryParams: { next: '/create-shop' } }), 1200);
        } else {
          // buyer: redirect to home
          setTimeout(() => this.router.navigate(['/']), 1000);
        }
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        const msg = err?.error?.message || err?.message || (this.lang() === 'ar' ? 'فشل اختيار الدور.' : 'Failed to select role.');
        this.serverError.set(msg);
      }
    });
  }
}
