import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ShopService } from '../../core/shop/shop.service';
import { FilesService } from '../../core/files/files.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';
import { AuthTokenService } from '../../core/api/auth-token.service';

@Component({
  standalone: true,
  templateUrl: './create-shop.page.html',
  styleUrl: './create-shop.page.css',
  imports: [ReactiveFormsModule, NgIf, TPipe]
})
export class CreateShopPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly shop = inject(ShopService);
  private readonly files = inject(FilesService);
  private readonly router = inject(Router);
  private readonly tokenService = inject(AuthTokenService);
  readonly i18n = inject(I18nService);

  protected readonly loading = signal(false);
  protected readonly checkingShop = signal(true);
  protected readonly serverError = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly lang = computed(() => this.i18n.lang());

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    imageUrl: [''],
    imageFile: [null]
  });

  ngOnInit(): void {
    // Check if user is logged in and is a seller
    if (!this.tokenService.token() || !this.tokenService.hasRole('Seller')) {
      this.router.navigate(['/']);
      return;
    }

    // Check if seller already has a shop
    this.shop.getMyShop().subscribe({
      next: (shop) => {
        this.checkingShop.set(false);
        if (shop && shop.shopId) {
          // Seller already has a shop, redirect to my-shop page
          this.router.navigate(['/my-shop']);
        }
      },
      error: () => {
        // No shop found, user can create one
        this.checkingShop.set(false);
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.loading.set(true);
    const val = this.form.getRawValue();

    const proceedCreate = (imageUrl?: string) => {
      this.shop.createShop({ name: val.name!, description: val.description!, imageUrl: imageUrl ?? val.imageUrl! }).subscribe({
        next: (res) => {
          this.loading.set(false);
          const msg = this.lang() === 'ar' ? 'تم إنشاء المتجر بنجاح، في انتظار موافقة المشرف.' : 'Shop created successfully and sent for admin approval';
          this.successMessage.set(msg);
          setTimeout(() => this.router.navigate(['/']), 1600);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          const msg = err?.error?.message || err?.message || (this.lang() === 'ar' ? 'فشل إنشاء المتجر.' : 'Failed to create shop.');
          this.serverError.set(msg);
        }
      });
    };

    // if user selected a file, upload it first
    const fileControl = this.form.get('imageFile')?.value as File | null;
    if (fileControl instanceof File) {
      this.files.upload(fileControl).subscribe({
        next: (res) => proceedCreate(res.url),
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          const msg = err?.error?.message || err?.message || (this.lang() === 'ar' ? 'فشل رفع الصورة.' : 'Failed to upload image.');
          this.serverError.set(msg);
        }
      });
    } else {
      // no file, use provided imageUrl or none
      proceedCreate();
    }
  }
}
