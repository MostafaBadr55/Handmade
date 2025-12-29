import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthTokenService } from '../../../core/api/auth-token.service';
import { CatalogService } from '../../../core/catalog/catalog.service';
import { Category, SubCategory } from '../../../core/models/catalog.models';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TPipe } from '../../../core/i18n/t.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TPipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private readonly tokenService = inject(AuthTokenService);
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  // Placeholder for logo image check
  logoImage = { src: '' };

  isLoggedIn = computed(() => !!this.tokenService.token());
  isSeller = computed(() => this.tokenService.hasRole('Seller'));
  isAdmin = computed(() => this.tokenService.hasRole('Admin') || this.tokenService.hasRole('SuperAdmin'));
  lang = computed(() => this.i18n.lang());

  // Profile link - sellers go to my-shop, buyers go to profile
  profileLink = computed(() => {
    if (this.isAdmin()) return '/admin';
    if (this.isSeller()) return '/my-shop';
    return '/profile';
  });

  categories = toSignal(this.catalogService.getCategories().pipe(
    catchError(() => of([]))
  ), { initialValue: [] as Category[] });

  showMenu = signal(false);
  expandedCategoryId = signal< number | null>(null);
  subCategories = signal<SubCategory[]>([]);

  toggleMenu() {
    this.showMenu.update(v => !v);
    if (!this.showMenu()) {
      this.expandedCategoryId.set(null);
      this.subCategories.set([]);
    }
  }

  toggleLang() {
    const newLang = this.i18n.lang() === 'en' ? 'ar' : 'en';
    this.i18n.setLang(newLang);
  }

  toggleCategory(categoryId: number) {
  if (this.expandedCategoryId() === categoryId) {
    this.expandedCategoryId.set(null);
    this.subCategories.set([]);
  } else {
    this.expandedCategoryId.set(categoryId);
    this.catalogService.getSubCategories(categoryId).subscribe({
      next: subs => this.subCategories.set(subs),
      error: () => this.subCategories.set([])
    });
  }
}

  logout() {
    this.tokenService.setToken(null);
    this.tokenService.setUserName(null);
    this.showMenu.set(false);
    this.router.navigate(['/login']);
  }
}
