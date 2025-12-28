import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../core/catalog/catalog.service';
import { FilesService } from '../../core/files/files.service';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  standalone: true,
  template: `
    <div class="container">
      <h2>{{ lang() === 'ar' ? 'إضافة تصنيف جديد' : 'Add New Category' }}</h2>
      <form (ngSubmit)="submit()">
        <div class="form-group">
          <label>{{ lang() === 'ar' ? 'الاسم' : 'Name' }}</label>
          <input name="name" [(ngModel)]="form.name" required />
        </div>
        <div class="form-group">
          <label>{{ lang() === 'ar' ? 'الوصف' : 'Description' }}</label>
          <textarea name="description" [(ngModel)]="form.description"></textarea>
        </div>
        <div class="form-group">
          <label>{{ lang() === 'ar' ? 'الصورة' : 'Image' }}</label>
          <input type="file" accept="image/*" (change)="onFileChange($event)" />
          <input name="imageUrl" [(ngModel)]="form.imageUrl" style="display:none" />
          <div *ngIf="form.imageUrl && form.imageUrl.length > 0" class="image-preview-container">
            <img [src]="form.imageUrl" alt="Preview" style="max-width:150px; border-radius:6px;" />
          </div>
        </div>
        <div class="actions">
          <button type="button" (click)="cancel()">{{ lang() === 'ar' ? 'إلغاء' : 'Cancel' }}</button>
          <button type="submit">{{ lang() === 'ar' ? 'إنشاء' : 'Create' }}</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
    input, textarea { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    textarea { min-height: 100px; }
    .actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; }
    button { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
    button[type="submit"] { background: #007bff; color: white; }
    button[type="button"] { background: #ccc; }
  `],
  imports: [CommonModule, FormsModule]
})
export class AddCategoryPage {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly filesService = inject(FilesService);
  private readonly i18n = inject(I18nService);
  lang = computed(() => this.i18n.lang());

  protected form = {
    name: '',
    description: '',
    imageUrl: ''
  };

  submit() {
    this.catalogService.createCategory(this.form).subscribe({
      next: () => this.router.navigate(['/my-shop']),
      error: (err) => console.error(err)
    });
  }

  cancel() {
    this.router.navigate(['/my-shop']);
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    this.filesService.upload(file, 'category').subscribe({
      next: (res) => this.form.imageUrl = res.url,
      error: (err) => {
        console.error('Upload failed', err);
        alert(this.lang() === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload image');
      }
    });
  }
}
