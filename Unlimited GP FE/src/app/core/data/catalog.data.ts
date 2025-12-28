import { Category, SubCategory } from '../models/catalog.models';

const CATEGORY_IMAGES = [
  'https://images.pexels.com/photos/26605624/pexels-photo-26605624.jpeg',
  'https://images.pexels.com/photos/4788183/pexels-photo-4788183.jpeg',
  'https://images.pexels.com/photos/28879544/pexels-photo-28879544.jpeg',
  'https://images.pexels.com/photos/12309059/pexels-photo-12309059.jpeg'
];

export const CATEGORIES: Category[] = [
  { id: 'paintings', nameEn: 'Paintings', nameAr: 'لوحات', imageUrl: CATEGORY_IMAGES[0] },
  { id: 'sculpture', nameEn: 'Sculpture', nameAr: 'نحت', imageUrl: CATEGORY_IMAGES[1] },
  { id: 'ceramics', nameEn: 'Ceramics & Pottery', nameAr: 'خزف وفخار', imageUrl: CATEGORY_IMAGES[2] },
  { id: 'crafts', nameEn: 'Handmade Crafts', nameAr: 'مشغولات يدوية', imageUrl: CATEGORY_IMAGES[3] },
  { id: 'drawings', nameEn: 'Drawings & Illustrations', nameAr: 'رسومات وإيضاحات', imageUrl: CATEGORY_IMAGES[0] },
  { id: 'decor', nameEn: 'Art Decor', nameAr: 'ديكور فني', imageUrl: CATEGORY_IMAGES[1] },
  { id: 'photography', nameEn: 'Photography', nameAr: 'تصوير فوتوغرافي', imageUrl: CATEGORY_IMAGES[2] },
  { id: 'student-projects', nameEn: 'Student Projects', nameAr: 'مشاريع طلاب', imageUrl: CATEGORY_IMAGES[3] }
];

export const SUBCATEGORIES: SubCategory[] = [
  // Paintings
  { id: 'oil', categoryId: 'paintings', nameEn: 'Oil Paintings', nameAr: 'لوحات زيت' },
  { id: 'acrylic', categoryId: 'paintings', nameEn: 'Acrylic Paintings', nameAr: 'لوحات أكريليك' },
  { id: 'watercolor', categoryId: 'paintings', nameEn: 'Watercolor Paintings', nameAr: 'ألوان مائية' },
  { id: 'charcoal', categoryId: 'paintings', nameEn: 'Charcoal & Pencil', nameAr: 'فحم ورصاص' },
  { id: 'pastel', categoryId: 'paintings', nameEn: 'Pastel Art', nameAr: 'باستيل' },
  { id: 'ink', categoryId: 'paintings', nameEn: 'Ink Art', nameAr: 'حبر' },
  { id: 'mixed-media', categoryId: 'paintings', nameEn: 'Mixed Media', nameAr: 'مكس ميديا' },
  { id: 'portrait', categoryId: 'paintings', nameEn: 'Portrait Paintings', nameAr: 'بورتريه' },
  { id: 'still-life', categoryId: 'paintings', nameEn: 'Still Life', nameAr: 'طبيعة صامتة' },
  { id: 'landscape', categoryId: 'paintings', nameEn: 'Landscape Paintings', nameAr: 'مناظر طبيعية' },
  { id: 'abstract', categoryId: 'paintings', nameEn: 'Abstract Art', nameAr: 'تجريدي' },
  { id: 'realistic', categoryId: 'paintings', nameEn: 'Realistic Art', nameAr: 'واقعي' },

  // Sculpture
  { id: 'clay', categoryId: 'sculpture', nameEn: 'Clay Sculpture', nameAr: 'نحت طين' },
  { id: 'plaster', categoryId: 'sculpture', nameEn: 'Plaster Sculpture', nameAr: 'نحت جبس' },
  { id: 'wood', categoryId: 'sculpture', nameEn: 'Wood Sculpture', nameAr: 'نحت خشب' },
  { id: 'stone', categoryId: 'sculpture', nameEn: 'Stone Sculpture', nameAr: 'نحت حجر' },
  { id: 'metal', categoryId: 'sculpture', nameEn: 'Metal Sculpture', nameAr: 'نحت معدن' },
  { id: 'mini', categoryId: 'sculpture', nameEn: 'Mini Sculptures', nameAr: 'مجسمات صغيرة' },
  { id: 'statues', categoryId: 'sculpture', nameEn: 'Statues', nameAr: 'تماثيل' },
  { id: 'relief', categoryId: 'sculpture', nameEn: 'Relief Sculpture', nameAr: 'نحت بارز' },

  // Ceramics
  { id: 'handmade-pottery', categoryId: 'ceramics', nameEn: 'Handmade Pottery', nameAr: 'فخار يدوي' },
  { id: 'glazed', categoryId: 'ceramics', nameEn: 'Glazed Ceramics', nameAr: 'خزف مزجج' },
  { id: 'decorative', categoryId: 'ceramics', nameEn: 'Decorative Ceramics', nameAr: 'خزف ديكوري' },
  { id: 'functional', categoryId: 'ceramics', nameEn: 'Functional Ceramics', nameAr: 'خزف استخدامي' },
  { id: 'ceramic-sculptures', categoryId: 'ceramics', nameEn: 'Ceramic Sculptures', nameAr: 'مجسمات خزفية' },

  // Crafts
  { id: 'macrame', categoryId: 'crafts', nameEn: 'Macramé', nameAr: 'مكرمية' },
  { id: 'embroidery', categoryId: 'crafts', nameEn: 'Embroidery', nameAr: 'تطريز' },
  { id: 'textile', categoryId: 'crafts', nameEn: 'Textile Art', nameAr: 'فن النسيج' },
  { id: 'leather', categoryId: 'crafts', nameEn: 'Leather Crafts', nameAr: 'مشغولات جلد' },
  { id: 'wood-crafts', categoryId: 'crafts', nameEn: 'Wood Crafts', nameAr: 'مشغولات خشب' },
  { id: 'recycled', categoryId: 'crafts', nameEn: 'Recycled Art', nameAr: 'فن مُعاد تدويره' },

  // Drawings
  { id: 'sketches', categoryId: 'drawings', nameEn: 'Sketches', nameAr: 'اسكتشات' },
  { id: 'manga', categoryId: 'drawings', nameEn: 'Manga & Comics', nameAr: 'مانجا وكوميكس' },
  { id: 'digital-printed', categoryId: 'drawings', nameEn: 'Digital Art (Printed)', nameAr: 'فن رقمي (مطبوع)' },
  { id: 'calligraphy', categoryId: 'drawings', nameEn: 'Calligraphy', nameAr: 'خط عربي' },
  { id: 'graphic-prints', categoryId: 'drawings', nameEn: 'Graphic Design Prints', nameAr: 'مطبوعات جرافيك' },

  // Decor
  { id: 'wall', categoryId: 'decor', nameEn: 'Wall Art', nameAr: 'ديكور حائط' },
  { id: 'framed', categoryId: 'decor', nameEn: 'Framed Art', nameAr: 'لوحات بإطار' },
  { id: 'mirrors', categoryId: 'decor', nameEn: 'Artistic Mirrors', nameAr: 'مرايا فنية' },
  { id: 'office', categoryId: 'decor', nameEn: 'Office Decor', nameAr: 'ديكور مكتب' },
  { id: 'room', categoryId: 'decor', nameEn: 'Room Decor', nameAr: 'ديكور غرفة' },

  // Photography
  { id: 'nature', categoryId: 'photography', nameEn: 'Nature Photography', nameAr: 'تصوير طبيعة' },
  { id: 'photo-portrait', categoryId: 'photography', nameEn: 'Portrait Photography', nameAr: 'بورتريه' },
  { id: 'bw', categoryId: 'photography', nameEn: 'Black & White Photography', nameAr: 'أبيض وأسود' },
  { id: 'architecture', categoryId: 'photography', nameEn: 'Architectural Photography', nameAr: 'تصوير معماري' },
  { id: 'fine-art-photo', categoryId: 'photography', nameEn: 'Fine Art Photography', nameAr: 'تصوير فنّي' },

  // Student Projects
  { id: 'first-year', categoryId: 'student-projects', nameEn: 'First-Year Projects', nameAr: 'مشاريع سنة أولى' },
  { id: 'graduation', categoryId: 'student-projects', nameEn: 'Graduation Projects', nameAr: 'مشاريع تخرج' },
  { id: 'training', categoryId: 'student-projects', nameEn: 'Training Projects', nameAr: 'مشاريع تدريب' },
  { id: 'models', categoryId: 'student-projects', nameEn: 'Study Models', nameAr: 'ماكيت ودراسات' }
];
