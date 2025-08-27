import { type User, type InsertUser, type Category, type InsertCategory, type Medicine, type InsertMedicine, type Review, type InsertReview, type CartItem, type InsertCartItem, type MedicineWithCategory, type CartItemWithMedicine } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Medicines
  getMedicines(categoryId?: string, search?: string, limit?: number): Promise<MedicineWithCategory[]>;
  getMedicine(id: string): Promise<MedicineWithCategory | undefined>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicineStock(id: string, stockCount: number): Promise<Medicine | undefined>;
  
  // Reviews
  getReviewsForMedicine(medicineId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Cart
  getCartItems(sessionId: string): Promise<CartItemWithMedicine[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(sessionId: string, medicineId: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(sessionId: string, medicineId: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private medicines: Map<string, Medicine>;
  private reviews: Map<string, Review>;
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.medicines = new Map();
    this.reviews = new Map();
    this.cartItems = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories = [
      { id: "cat1", name: "Pain Relief", slug: "pain-relief", icon: "fas fa-tablets", description: "Relief from aches and pains", itemCount: 245 },
      { id: "cat2", name: "Antibiotics", slug: "antibiotics", icon: "fas fa-capsules", description: "Bacterial infection treatment", itemCount: 156 },
      { id: "cat3", name: "Vitamins & Supplements", slug: "vitamins", icon: "fas fa-leaf", description: "Nutritional supplements", itemCount: 189 },
      { id: "cat4", name: "Diabetes Care", slug: "diabetes", icon: "fas fa-syringe", description: "Diabetes management", itemCount: 87 },
      { id: "cat5", name: "Heart Care", slug: "heart-care", icon: "fas fa-heartbeat", description: "Cardiovascular health", itemCount: 134 },
      { id: "cat6", name: "Skin Care", slug: "skin-care", icon: "fas fa-hand-holding-medical", description: "Dermatological treatments", itemCount: 198 },
    ];

    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Seed medicines
    const medicines = [
      {
        id: "med1",
        name: "Paracetamol 500mg",
        description: "Strip of 10 tablets",
        categoryId: "cat1",
        price: "24.50",
        originalPrice: "35.00",
        stockCount: 45,
        stockThreshold: 10,
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        manufacturer: "ABC Pharma",
        composition: "Paracetamol 500mg",
        dosage: "1-2 tablets every 4-6 hours",
        packSize: "10 tablets",
        requiresPrescription: 0,
        averageRating: "4.5",
        reviewCount: 234,
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "med2",
        name: "Amoxicillin 250mg",
        description: "Bottle of 21 capsules",
        categoryId: "cat2",
        price: "156.00",
        originalPrice: "180.00",
        stockCount: 8,
        stockThreshold: 10,
        imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        manufacturer: "XYZ Labs",
        composition: "Amoxicillin 250mg",
        dosage: "1 capsule every 8 hours",
        packSize: "21 capsules",
        requiresPrescription: 1,
        averageRating: "4.2",
        reviewCount: 89,
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "med3",
        name: "Vitamin D3 1000 IU",
        description: "Bottle of 60 tablets",
        categoryId: "cat3",
        price: "299.00",
        originalPrice: "350.00",
        stockCount: 67,
        stockThreshold: 10,
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        manufacturer: "Health Plus",
        composition: "Vitamin D3 1000 IU",
        dosage: "1 tablet daily",
        packSize: "60 tablets",
        requiresPrescription: 0,
        averageRating: "4.8",
        reviewCount: 445,
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "med4",
        name: "Amlodipine 5mg",
        description: "Strip of 10 tablets",
        categoryId: "cat5",
        price: "89.50",
        originalPrice: "110.00",
        stockCount: 32,
        stockThreshold: 10,
        imageUrl: "https://images.unsplash.com/photo-1559757147-5e813fc2d999?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        manufacturer: "Cardio Care",
        composition: "Amlodipine 5mg",
        dosage: "1 tablet daily",
        packSize: "10 tablets",
        requiresPrescription: 1,
        averageRating: "4.3",
        reviewCount: 156,
        isActive: 1,
        createdAt: new Date(),
      },
    ];

    medicines.forEach(med => this.medicines.set(med.id, med));

    // Seed reviews
    const reviews = [
      {
        id: "rev1",
        medicineId: "med1",
        userId: null,
        customerName: "Rajesh Kumar",
        rating: 5,
        comment: "Very effective for headaches. Quick relief and no side effects.",
        isVerified: 1,
        createdAt: new Date(),
      },
      {
        id: "rev2",
        medicineId: "med1",
        userId: null,
        customerName: "Priya Sharma",
        rating: 4,
        comment: "Good quality medicine. Works as expected.",
        isVerified: 1,
        createdAt: new Date(),
      },
      {
        id: "rev3",
        medicineId: "med3",
        userId: null,
        customerName: "Amit Patel",
        rating: 5,
        comment: "Excellent vitamin supplement. Noticed improvement in energy levels.",
        isVerified: 1,
        createdAt: new Date(),
      },
    ];

    reviews.forEach(rev => this.reviews.set(rev.id, rev));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async getMedicines(categoryId?: string, search?: string, limit?: number): Promise<MedicineWithCategory[]> {
    let medicines = Array.from(this.medicines.values()).filter(med => med.isActive === 1);
    
    if (categoryId) {
      medicines = medicines.filter(med => med.categoryId === categoryId);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      medicines = medicines.filter(med => 
        med.name.toLowerCase().includes(searchLower) ||
        med.description.toLowerCase().includes(searchLower) ||
        med.composition?.toLowerCase().includes(searchLower)
      );
    }
    
    if (limit) {
      medicines = medicines.slice(0, limit);
    }

    return medicines.map(med => ({
      ...med,
      category: this.categories.get(med.categoryId)!,
    }));
  }

  async getMedicine(id: string): Promise<MedicineWithCategory | undefined> {
    const medicine = this.medicines.get(id);
    if (!medicine) return undefined;

    const category = this.categories.get(medicine.categoryId);
    if (!category) return undefined;

    const reviews = Array.from(this.reviews.values()).filter(rev => rev.medicineId === id);

    return {
      ...medicine,
      category,
      reviews,
    };
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const id = randomUUID();
    const medicine: Medicine = { 
      ...insertMedicine, 
      id, 
      averageRating: "0.0",
      reviewCount: 0,
      createdAt: new Date() 
    };
    this.medicines.set(id, medicine);
    return medicine;
  }

  async updateMedicineStock(id: string, stockCount: number): Promise<Medicine | undefined> {
    const medicine = this.medicines.get(id);
    if (!medicine) return undefined;

    const updated = { ...medicine, stockCount };
    this.medicines.set(id, updated);
    return updated;
  }

  async getReviewsForMedicine(medicineId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(rev => rev.medicineId === medicineId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);

    // Update medicine rating
    const medicine = this.medicines.get(insertReview.medicineId);
    if (medicine) {
      const allReviews = Array.from(this.reviews.values()).filter(rev => rev.medicineId === insertReview.medicineId);
      const avgRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;
      
      const updated = { 
        ...medicine, 
        averageRating: avgRating.toFixed(1),
        reviewCount: allReviews.length 
      };
      this.medicines.set(insertReview.medicineId, updated);
    }

    return review;
  }

  async getCartItems(sessionId: string): Promise<CartItemWithMedicine[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    
    return items.map(item => {
      const medicine = this.medicines.get(item.medicineId);
      return {
        ...item,
        medicine: medicine!,
      };
    }).filter(item => item.medicine);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertCartItem.sessionId && item.medicineId === insertCartItem.medicineId
    );

    if (existingItem) {
      const updated = { ...existingItem, quantity: existingItem.quantity + insertCartItem.quantity };
      this.cartItems.set(existingItem.id, updated);
      return updated;
    }

    const id = randomUUID();
    const cartItem: CartItem = { ...insertCartItem, id, createdAt: new Date() };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(sessionId: string, medicineId: string, quantity: number): Promise<CartItem | undefined> {
    const item = Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.medicineId === medicineId
    );

    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(item.id);
      return undefined;
    }

    const updated = { ...item, quantity };
    this.cartItems.set(item.id, updated);
    return updated;
  }

  async removeFromCart(sessionId: string, medicineId: string): Promise<boolean> {
    const item = Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.medicineId === medicineId
    );

    if (!item) return false;

    this.cartItems.delete(item.id);
    return true;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    items.forEach(item => this.cartItems.delete(item.id));
    return true;
  }
}

export const storage = new MemStorage();
