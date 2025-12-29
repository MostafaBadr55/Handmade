import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor, CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService, ShopModel } from '../../core/shop/shop.service';
import { AuthTokenService } from '../../core/api/auth-token.service';
import { FilesService } from '../../core/files/files.service';
import { CatalogService } from '../../core/catalog/catalog.service';
import { Category, SubCategory } from '../../core/models/catalog.models';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

type ProductTabType = 'all' | 'active' | 'inactive' | 'pending';

@Component({
  standalone: true,
  templateUrl: './my-shop.page.html',
  styleUrls: ['./my-shop.page.css'],
  imports: [NgIf, NgFor, CommonModule, FormsModule, CurrencyPipe, TPipe]
})
export class MyShopPage {
  private readonly shopService = inject(ShopService);
  private readonly catalogService = inject(CatalogService);
  private readonly filesService = inject(FilesService);
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly tokenService = inject(AuthTokenService);

  protected readonly loading = signal(true);
  protected readonly serverError = signal<string | null>(null);
  protected readonly shop = signal<ShopModel | null>(null);
  protected readonly categories = signal<Category[]>([]);
  protected readonly subCategories = signal<SubCategory[]>([]);
  protected readonly products = signal<any[]>([]);

  // Product tabs
  protected readonly productTab = signal<ProductTabType>('all');

  // Product filters
  protected readonly activeProducts = computed(() =>
    this.products().filter(p => (p.status || '').toString().toLowerCase() === 'active' &&
      (p.approvalStatus || 'Approved').toString().toLowerCase() === 'approved')
  );
  protected readonly inactiveProducts = computed(() =>
    this.products().filter(p => (p.status || '').toString().toLowerCase() === 'inactive')
  );
  protected readonly pendingProducts = computed(() =>
    this.products().filter(p => (p.approvalStatus || '').toString().toLowerCase() === 'pending')
  );

  protected readonly displayedProducts = computed(() => {
    const tab = this.productTab();
    switch (tab) {
      case 'active': return this.activeProducts();
      case 'inactive': return this.inactiveProducts();
      case 'pending': return this.pendingProducts();
      default: return this.products();
    }
  });

  protected readonly lang = computed(() => this.i18n.lang());
  protected readonly isActive = computed(() => {
    const s = this.shop()?.status ?? '';
    return !!s && s.toString().toLowerCase() === 'active';
  });
  protected readonly isRejected = computed(() => {
    const s = this.shop()?.status ?? '';
    return !!s && s.toString().toLowerCase() === 'rejected';
  });
  protected readonly isPending = computed(() => {
    const s = this.shop()?.status ?? '';
    return !!s && s.toString().toLowerCase() === 'pending';
  });

  protected readonly showEditModal = signal(false);
  protected readonly editForm = signal({
    shopName: '',
    description: '',
    imageUrl: ''
  });

  protected readonly showAddProductModal = signal(false);
  protected readonly isAddingProduct = signal(false);
  protected readonly addProductForm = signal({
    title: '',
    price: 0,
    categoryId: '',
    subCategoryId: '',
    imageUrl: ''
  });

  protected readonly uploadInProgress = signal(false);


  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.serverError.set(null);
    this.shopService.getMyShop().subscribe({
      next: (s: any) => {
        // Normalize shopId if the API returns 'id' instead of 'shopId'
        if (s && !s.shopId && s.id) {
          s.shopId = s.id;
        }

        this.shop.set(s);
        this.loading.set(false);

        if (s?.shopId) {
          this.loadProducts(s.shopId);
          this.editForm.set({
            shopName: s.shopName || s.name || '',
            description: s.description || '',
            imageUrl: s.imageUrl || ''
          });
        } else {
          console.warn('Shop loaded but no shopId found in response:', s);
        }
      },
      error: (err) => {
        console.error(err);

        if (err.status === 404) {
          this.shop.set(null);
          this.serverError.set(null);
        } else {
          this.serverError.set(
            err?.error?.message ||
            err?.message ||
            (this.lang() === 'ar' ? 'فشل جلب المتجر.' : 'Failed to fetch shop.')
          );
        }

        this.loading.set(false);
      }
    });

    // Load categories and subcategories
    this.catalogService.getCategories().subscribe({ next: (cats) => this.categories.set(cats) });
    // Note: Subcategories usually depend on category, but if we want all, we might need a different API or iterate.
    // For now, we'll load them on demand or if the API supports getting all.
    // The user asked to "get category and subcategory", implying all.
    // Assuming getSubCategories without ID returns all or we can't fetch all easily without an endpoint.
    // We will stick to fetching categories here.
  }

  private loadProducts(shopId: number | string): void {
    this.shopService.getShopProducts(shopId).subscribe({ next: (res) => this.products.set(res?.items || res || []) });
  }

  openAddProduct() {
    const s = this.shop() as any;
    const shopId = s?.shopId || s?.id;

    if (shopId) {
      this.addProductForm.set({
        title: '',
        price: 0,
        categoryId: '',
        subCategoryId: '',
        imageUrl: ''
      });
      this.showAddProductModal.set(true);
    } else {
      alert(this.lang() === 'ar' ? 'لا يمكن إضافة منتج: معرف المتجر مفقود.' : 'Cannot add product: shopId is missing.');
    }
  }

  closeAddProductModal() {
    this.showAddProductModal.set(false);
  }

  onCategoryChange(categoryId: number) {
    if (categoryId) {
      this.catalogService.getSubCategories(categoryId).subscribe({
        next: (subs) => this.subCategories.set(subs)
      });
    } else {
      this.subCategories.set([]);
    }
  }

  onEditFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    this.uploadInProgress.set(true);
    this.filesService.upload(file, 'shop').subscribe({
      next: (res) => {
        const cur = this.editForm();
        this.editForm.set({ ...cur, imageUrl: res.url });
        this.uploadInProgress.set(false);
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.uploadInProgress.set(false);
        alert(this.lang() === 'ar' ? 'فشل رفع الصورة.' : 'Failed to upload image.');
      }
    });
  }

  onAddProductFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    this.uploadInProgress.set(true);
    this.filesService.upload(file, 'product').subscribe({
      next: (res) => {
        const cur = this.addProductForm();
        this.addProductForm.set({ ...cur, imageUrl: res.url });
        this.uploadInProgress.set(false);
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.uploadInProgress.set(false);
        alert(this.lang() === 'ar' ? 'فشل رفع الصورة.' : 'Failed to upload image.');
      }
    });
  }

  submitAddProduct() {
    const s = this.shop() as any;
    const shopId = s?.shopId || s?.id;

    if (!shopId) return;

    const form = this.addProductForm();
    if (!form.title || !form.price || !form.categoryId || !form.subCategoryId) {
      alert(this.lang() === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill all required fields.');
      return;
    }

    this.isAddingProduct.set(true);

    const payload = {
      shopId: Number(shopId),
      categoryId: Number(form.categoryId),
      subCategoryId: Number(form.subCategoryId),
      title: form.title,
      price: form.price,
      images: form.imageUrl ? [{
        url: form.imageUrl,
        altText: form.title,
        isPrimary: true,
        sortOrder: 0
      }] : []
    };

    this.shopService.createProduct(shopId, payload).subscribe({
      next: () => {
        this.isAddingProduct.set(false);
        this.showAddProductModal.set(false);
        this.loadProducts(shopId); // Refresh the list
        alert(this.lang() === 'ar' ? 'تم إضافة المنتج بنجاح!' : 'Product added successfully!');
      },
      error: (err) => {
        this.isAddingProduct.set(false);
        console.error('Error creating product:', err);
        alert(this.lang() === 'ar' ? 'فشل إضافة المنتج. يرجى المحاولة مرة أخرى.' : 'Failed to add product. Please try again.');
      }
    });
  }

  openAddCategory() {
    this.router.navigate(['/my-shop/add-category']);
  }

  openAddSubCategory() {
    this.router.navigate(['/my-shop/add-subcategory']);
  }

  setProductTab(tab: ProductTabType) {
    this.productTab.set(tab);
  }

  createShop() {
    this.router.navigate(['/create-shop']);
  }

  openEditModal() {
    const s = this.shop();
    if (s) {
      this.editForm.set({
        shopName: s.shopName || s.name || '',
        description: s.description || '',
        imageUrl: s.imageUrl || ''
      });
      this.showEditModal.set(true);
    }
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  submitEdit() {
    const s = this.shop();
    console.log('submitEdit called, current shop:', s, 'editForm:', this.editForm());
    console.log('submitEdit: auth token present:', !!this.tokenService.token());
    if (!s || !s.shopId) {
      console.warn('submitEdit: missing shop or shopId, aborting');
      alert(this.lang() === 'ar' ? 'لا يوجد متجر صالح للحفظ.' : 'No shop available to save.');
      return;
    }

    // Build a robust payload: ensure numeric shopId and include both `name` and `shopName`
    const form = this.editForm();
    const payload: ShopModel = {
      shopId: Number(s.shopId),
      shopName: form.shopName || '',
      name: form.shopName || '',
      description: form.description,
      imageUrl: form.imageUrl
    };

    console.log('submitEdit payload:', JSON.stringify(payload));

    this.shopService.updateShop(payload).subscribe({
      next: () => {
        console.log('updateShop succeeded');
        this.showEditModal.set(false);
        this.load(); // Reload to get updated data and potentially new status
        alert(this.lang() === 'ar' ? 'تم حفظ التغييرات بنجاح.' : 'Changes saved successfully.');
      },
      error: (err) => {
        console.error('updateShop error:', err);
        // Log server response body if any for debugging
        try {
          console.error('updateShop error body:', err?.error);
        } catch (e) {
          console.error('failed to stringify error body', e);
        }

        const serverMsg = (err && err.error && (err.error.message || err.error)) || err?.message;
        this.serverError.set(
          serverMsg || (this.lang() === 'ar' ? 'فشل تحديث المتجر.' : 'Failed to update shop.')
        );

        alert(this.lang() === 'ar' ? 'حدث خطأ أثناء حفظ التغييرات. تحقق من الكونسول.' : 'Error saving changes. Check console.');
      }
    });
  }

  // Helpers to update signal-backed form fields from templates
  protected setEditField(field: keyof (typeof this.editForm extends () => infer R ? R : any), value: any) {
    const cur = this.editForm();
    // @ts-ignore - dynamic key assignment
    this.editForm.set({ ...cur, [field as string]: value });
  }

  protected setAddProductField(field: keyof (typeof this.addProductForm extends () => infer R ? R : any), value: any) {
    const cur = this.addProductForm();
    // @ts-ignore - dynamic key assignment
    this.addProductForm.set({ ...cur, [field as string]: value });
  }
}
