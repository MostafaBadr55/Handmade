import { Routes } from '@angular/router';
import { RoleGuard, SelectRoleGuard } from './core/auth/role.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.page').then((m) => m.LandingPage),
    // Landing page route
    title: 'Unlimited'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.page').then((m) => m.ProductsPage),
    title: 'Products - Unlimited'
  },
  {
    path: 'categories/:categoryId/subcategories',
    loadComponent: () =>
      import('./features/subcategories/subcategories.page').then((m) => m.SubCategoriesPage),
    title: 'Unlimited'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.page').then((m) => m.LoginPage),
    title: 'Login - Unlimited'
  },
  {
    path: 'select-role',
    loadComponent: () => import('./features/select-role/select-role.page').then((m) => m.SelectRolePage),
    title: 'Choose Role - Unlimited',
    canActivate: [SelectRoleGuard]
  },
  {
    path: 'create-shop',
    loadComponent: () => import('./features/create-shop/create-shop.page').then((m) => m.CreateShopPage),
    title: 'Create Shop - Unlimited',
    canActivate: [RoleGuard],
    data: { roles: ['Seller'] }
  },
  {
    path: 'my-shop',
    loadComponent: () => import('./features/my-shop/my-shop.page').then((m) => m.MyShopPage),
    title: 'My Shop - Unlimited',
    canActivate: [RoleGuard],
    data: { roles: ['Seller', 'Buyer'] }
  },
  {
    path: 'my-shop/add-product',
    loadComponent: () => import('./features/my-shop/add-product.page').then((m) => m.AddProductPage),
    title: 'Add Product - Unlimited',
    canActivate: [RoleGuard],
    data: { roles: ['Seller'] }
  },
  {
    path: 'my-shop/add-category',
    loadComponent: () => import('./features/my-shop/add-category.page').then((m) => m.AddCategoryPage),
    title: 'Add Category - Unlimited',
    canActivate: [RoleGuard],
    data: { roles: ['Seller'] }
  },
  {
    path: 'my-shop/add-subcategory',
    loadComponent: () => import('./features/my-shop/add-subcategory.page').then((m) => m.AddSubCategoryPage),
    title: 'Add Subcategory - Unlimited',
    canActivate: [RoleGuard],
    data: { roles: ['Seller'] }
  },
  {
    path: 'my-shop/manage',
    loadComponent: () => import('./features/my-shop/manage.page').then((m) => m.MyShopManagePage),
    title: 'Manage My Shop - Unlimited',
    canActivate: [RoleGuard],
    data: { roles: ['Seller'] }
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin-dashboard/admin-dashboard.page').then((m) => m.AdminDashboardPage),
    title: 'Admin Dashboard - Unlimited',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'SuperAdmin', 'Super Admin'] }
  },
  {
    path: 'admin/shops/pending',
    loadComponent: () => import('./features/admin-pending-shops/admin-pending-shops.page').then((m) => m.AdminPendingShopsPage),
    title: 'Pending Shops - Admin',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'SuperAdmin', 'Super Admin'] }
  },
  {
    path: 'admin/products/pending',
    loadComponent: () => import('./features/admin-products-pending/admin-products-pending.page').then((m) => m.AdminProductsPendingPage),
    title: 'Pending Products - Admin',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'SuperAdmin', 'Super Admin'] }
  },
  {
    path: 'admin/products/approved',
    loadComponent: () => import('./features/admin-products-approved/admin-products-approved.page').then((m) => m.AdminProductsApprovedPage),
    title: 'Approved Products - Admin',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'SuperAdmin', 'Super Admin'] }
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.page').then((m) => m.RegisterPage),
    title: 'Register - Unlimited'
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.page').then((m) => m.CartPage),
    title: 'Cart - Unlimited'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
