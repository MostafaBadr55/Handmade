import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/catalog/catalog.service';
import { Category } from '../../../core/models/catalog.models';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AuthTokenService } from '../../../core/api/auth-token.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TPipe } from '../../../core/i18n/t.pipe';
import { CartService } from '../../../core/cart/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgFor, CommonModule, TPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private router = inject(Router);
  private tokenService = inject(AuthTokenService);
  private cartService = inject(CartService);
  readonly i18n = inject(I18nService);

  isLoggedIn = computed(() => !!this.tokenService.token());
  userName = computed(() => this.tokenService.userName() || 'User');
  lang = computed(() => this.i18n.lang());
  cartCount = computed(() => this.cartService.cartCount());
  
  userRole = computed(() => {
    const role = this.tokenService.role();
    return role?.toLowerCase() || '';
  });
  
  isAdmin = computed(() => {
    const role = this.userRole();
    return role === 'admin' || role === 'superadmin' || role === 'super admin';
  });
  
  isSeller = computed(() => this.userRole() === 'seller');
  isBuyer = computed(() => this.userRole() === 'buyer');
  
  profileLink = computed(() => {
    if (this.isAdmin()) return '/admin';
    if (this.isSeller()) return '/my-shop';
    return '/profile';
  });

  categories = toSignal(this.catalogService.getCategories().pipe(
    catchError(() => of([]))
  ), { initialValue: [] as Category[] });

  hideTopBar() {
    const url = this.router.url || '';
    return url.includes('/login') || url.includes('/register');
  }

  ngOnInit() {
    // Refresh cart count when logged in
    if (this.isLoggedIn()) {
      this.cartService.refreshCartCount();
    }
  }

  toggleLang() {
    const newLang = this.i18n.lang() === 'en' ? 'ar' : 'en';
    this.i18n.setLang(newLang);
  }

  logout() {
    this.tokenService.setToken(null);
    this.tokenService.setUserName(null);
    this.router.navigate(['/login']);
  }
}
