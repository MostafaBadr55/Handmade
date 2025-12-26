import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/admin/admin.service';
import { FilesService } from '../../core/files/files.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

type TabType = 'shops' | 'products' | 'users' | 'categories' | 'subcategories';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TPipe],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.css'
})
export class AdminDashboardPage {
  private readonly adminService = inject(AdminService);
  readonly i18n = inject(I18nService);
  lang = computed(() => this.i18n.lang());
  private searchTimeout: any = null;

  activeTab = signal<TabType>('shops');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Shops
  shops = signal<any[]>([]);
  pendingShops = signal<any[]>([]);
  shopFilters = signal({
    Status: '',
    Name: '',
    pageNumber: 1,
    pageSize: 20
  });

  // Products
  products = signal<any[]>([]);
  productFilters = signal({
    ApprovalStatus: '' as '' | 'Pending' | 'Approved' | 'Rejected',
    Status: '' as '' | 'Active' | 'InActive',
    pageNumber: 1,
    pageSize: 20
  });

  // Users - Assign Role
  assignRoleData = signal({ userName: '', roleName: '' });

  // Categories
  categories = signal<any[]>([]);
  categoryForm = signal({ id: 0, name: '', description: '', imageUrl: '' });
  editingCategory = signal(false);
  uploadInProgress = signal(false);
  private readonly filesService = inject(FilesService);

  // SubCategories
  subCategories = signal<any[]>([]);
  subCategoryForm = signal({ id: 0, categoryId: 0, name: '' });
  editingSubCategory = signal(false);

  // Reject Modal
  showRejectModal = signal(false);
  rejectType = signal<'shop' | 'product'>('shop');
  rejectId = signal<number>(0);
  rejectMessage = signal('');

  constructor() {
    this.loadShops();
  }

  setActiveTab(tab: TabType) {
    this.activeTab.set(tab);
    this.error.set(null);
    this.success.set(null);

    switch (tab) {
      case 'shops':
        this.loadShops();
        break;
      case 'products':
        this.loadProducts();
        break;
      case 'categories':
        this.loadCategories();
        break;
      case 'subcategories':
        this.loadSubCategories();
        break;
    }
  }

  // ============ SHOPS ============
  loadShops() {
    this.loadAllShops();
    this.loadPendingShops();
  }

  loadAllShops() {
    const filters = this.shopFilters();
    const params: any = { pageNumber: filters.pageNumber, pageSize: filters.pageSize };
    if (filters.Status) params.Status = filters.Status;
    if (filters.Name) params.Name = filters.Name;

    this.adminService.getShops(params).subscribe({
      next: (res) => {
        this.shops.set(Array.isArray(res) ? res : res.items || res.data || []);
      },
      error: (err) => {
        this.error.set('Failed to load shops');
      }
    });
  }

  loadPendingShops() {
    this.adminService.getPendingShops().subscribe({
      next: (res) => this.pendingShops.set(res || []),
      error: () => {}
    });
  }

  approveShop(shopId: number) {
    this.adminService.approveShop(shopId).subscribe({
      next: () => {
        this.success.set('Shop approved successfully!');
        this.loadShops();
      },
      error: () => this.error.set('Failed to approve shop')
    });
  }

  openRejectShopModal(shopId: number) {
    this.rejectType.set('shop');
    this.rejectId.set(shopId);
    this.rejectMessage.set('');
    this.showRejectModal.set(true);
  }

  // ============ PRODUCTS ============
  loadProducts() {
    this.loading.set(true);
    const filters = this.productFilters();
    const params: any = { pageNumber: filters.pageNumber, pageSize: filters.pageSize };
    if (filters.ApprovalStatus) params.ApprovalStatus = filters.ApprovalStatus;
    if (filters.Status) params.Status = filters.Status;

    this.adminService.getProducts(params).subscribe({
      next: (res) => {
        this.products.set(Array.isArray(res) ? res : res.items || res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products');
        this.loading.set(false);
      }
    });
  }

  approveProduct(productId: number) {
    this.adminService.approveProduct(productId).subscribe({
      next: () => {
        this.success.set('Product approved successfully!');
        this.loadProducts();
      },
      error: () => this.error.set('Failed to approve product')
    });
  }

  openRejectProductModal(productId: number) {
    this.rejectType.set('product');
    this.rejectId.set(productId);
    this.rejectMessage.set('');
    this.showRejectModal.set(true);
  }

  // ============ REJECT MODAL ============
  confirmReject() {
    const type = this.rejectType();
    const id = this.rejectId();
    const message = this.rejectMessage();

    if (type === 'shop') {
      this.adminService.rejectShop(id, message).subscribe({
        next: () => {
          this.success.set('Shop rejected successfully!');
          this.showRejectModal.set(false);
          this.loadShops();
        },
        error: () => this.error.set('Failed to reject shop')
      });
    } else {
      this.adminService.rejectProduct(id, message).subscribe({
        next: () => {
          this.success.set('Product rejected successfully!');
          this.showRejectModal.set(false);
          this.loadProducts();
        },
        error: () => this.error.set('Failed to reject product')
      });
    }
  }

  // ============ USERS ============
  assignRole() {
    const data = this.assignRoleData();
    if (!data.userName || !data.roleName) {
      this.error.set('Please fill in username and role name');
      return;
    }

    this.adminService.assignRole(data.userName, data.roleName).subscribe({
      next: () => {
        this.success.set('Role assigned successfully!');
        this.assignRoleData.set({ userName: '', roleName: '' });
      },
      error: () => this.error.set('Failed to assign role')
    });
  }

  // ============ CATEGORIES ============
  loadCategories() {
    this.loading.set(true);
    this.adminService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load categories');
        this.loading.set(false);
      }
    });
  }

  saveCategory() {
    const form = this.categoryForm();
    if (!form.name) {
      this.error.set('Category name is required');
      return;
    }

    const payload = { 
      name: form.name, 
      description: form.description, 
      imageUrl: form.imageUrl,
      ...(form.id ? { id: form.id } : {})
    };

    const action = this.editingCategory() 
      ? this.adminService.updateCategory(payload)
      : this.adminService.createCategory(payload);

    action.subscribe({
      next: () => {
        this.success.set(this.editingCategory() ? 'Category updated!' : 'Category created!');
        this.resetCategoryForm();
        this.loadCategories();
      },
      error: () => this.error.set('Failed to save category')
    });
  }

  editCategory(cat: any) {
    this.categoryForm.set({
      id: cat.id || cat.categoryId,
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || ''
    });
    this.editingCategory.set(true);
  }

  deleteCategory(id: number) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    this.adminService.deleteCategory(id).subscribe({
      next: () => {
        this.success.set('Category deleted!');
        this.loadCategories();
      },
      error: () => this.error.set('Failed to delete category')
    });
  }

  resetCategoryForm() {
    this.categoryForm.set({ id: 0, name: '', description: '', imageUrl: '' });
    this.editingCategory.set(false);
  }

  // ============ SUBCATEGORIES ============
  loadSubCategories() {
    this.loading.set(true);
    this.adminService.getAllSubCategories().subscribe({
      next: (res) => {
        this.subCategories.set(res || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load subcategories');
        this.loading.set(false);
      }
    });
    // Also load categories for dropdown
    this.adminService.getCategories().subscribe({
      next: (res) => this.categories.set(res || []),
      error: () => {}
    });
  }

  saveSubCategory() {
    const form = this.subCategoryForm();
    if (!form.name || !form.categoryId) {
      this.error.set('Name and Category are required');
      return;
    }

    const payload = { 
      name: form.name, 
      categoryId: form.categoryId,
      ...(form.id ? { id: form.id } : {})
    };

    const action = this.editingSubCategory()
      ? this.adminService.updateSubCategory(payload)
      : this.adminService.createSubCategory(payload);

    action.subscribe({
      next: () => {
        this.success.set(this.editingSubCategory() ? 'SubCategory updated!' : 'SubCategory created!');
        this.resetSubCategoryForm();
        this.loadSubCategories();
      },
      error: () => this.error.set('Failed to save subcategory')
    });
  }

  editSubCategory(sub: any) {
    this.subCategoryForm.set({
      id: sub.id,
      categoryId: sub.categoryId,
      name: sub.name
    });
    this.editingSubCategory.set(true);
  }

  deleteSubCategory(id: number) {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;

    this.adminService.deleteSubCategory(id).subscribe({
      next: () => {
        this.success.set('SubCategory deleted!');
        this.loadSubCategories();
      },
      error: () => this.error.set('Failed to delete subcategory')
    });
  }

  resetSubCategoryForm() {
    this.subCategoryForm.set({ id: 0, categoryId: 0, name: '' });
    this.editingSubCategory.set(false);
  }

  // ============ FORM HELPER METHODS ============
  updateShopName(value: string) {
    this.shopFilters.update(f => ({ ...f, Name: value }));
    // Debounce search - wait 400ms after user stops typing
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadAllShops(), 400);
  }

  updateShopStatus(value: string) {
    this.shopFilters.update(f => ({ ...f, Status: value }));
    this.loadAllShops();
  }

  updateProductApprovalStatus(value: '' | 'Pending' | 'Approved' | 'Rejected') {
    this.productFilters.update(f => ({ ...f, ApprovalStatus: value }));
    this.loadProducts();
  }

  updateProductStatus(value: '' | 'Active' | 'InActive') {
    this.productFilters.update(f => ({ ...f, Status: value }));
    this.loadProducts();
  }

  updateAssignRoleUserName(value: string) {
    this.assignRoleData.update(d => ({ ...d, userName: value }));
  }

  updateAssignRoleRoleName(value: string) {
    this.assignRoleData.update(d => ({ ...d, roleName: value }));
  }

  updateCategoryName(value: string) {
    this.categoryForm.update(f => ({ ...f, name: value }));
  }

  updateCategoryDescription(value: string) {
    this.categoryForm.update(f => ({ ...f, description: value }));
  }

  onCategoryFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    this.uploadInProgress.set(true);
    this.filesService.upload(file, 'category').subscribe({
      next: (res) => {
        this.categoryForm.update(f => ({ ...f, imageUrl: res.url }));
        this.uploadInProgress.set(false);
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.uploadInProgress.set(false);
        this.error.set(this.lang() === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload image');
      }
    });
  }

  updateSubCategoryCategoryId(value: string) {
    this.subCategoryForm.update(f => ({ ...f, categoryId: +value }));
  }

  updateSubCategoryName(value: string) {
    this.subCategoryForm.update(f => ({ ...f, name: value }));
  }

  updateRejectMessage(value: string) {
    this.rejectMessage.set(value);
  }
}
