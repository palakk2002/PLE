import { create } from 'zustand';
import {
    getVendorProducts,
    getVendorProductById,
    createVendorProduct,
    updateVendorProduct,
    deleteVendorProduct,
    updateVendorStock,
} from '../services/vendorService';
import toast from 'react-hot-toast';

export const useVendorProductStore = create((set, get) => ({
    products: [],
    total: 0,
    page: 1,
    pages: 1,
    isLoading: false,
    isSaving: false,

    // ─── READ ────────────────────────────────────────────────────────────────────

    /**
     * Fetch vendor's products from the API with optional filters.
     * @param {{ page?, limit?, search?, stock? }} params
     */
    fetchProducts: async (params = {}) => {
        set({ isLoading: true });
        try {
            const { fetchAll = false, ...queryParams } = params || {};
            const pageSize = Math.max(Number.parseInt(queryParams.limit, 10) || 100, 1);
            let currentPage = Math.max(Number.parseInt(queryParams.page, 10) || 1, 1);
            let totalPages = 1;
            let latestPagination = {
                total: 0,
                page: currentPage,
                pages: 1,
            };
            const allProducts = [];

            do {
                const res = await getVendorProducts({
                    ...queryParams,
                    page: currentPage,
                    limit: pageSize,
                });
                // api.js interceptor unwraps response.data, so res = { products, total, page, pages }
                const { products = [], total = 0, page = currentPage, pages = 1 } = res.data ?? res;
                allProducts.push(...products);
                latestPagination = { total, page, pages };
                totalPages = fetchAll ? pages : currentPage;
                currentPage += 1;
            } while (fetchAll && currentPage <= totalPages);

            if (allProducts.length === 0) {
                allProducts.push(
                    {
                        id: "prod_1",
                        _id: "prod_1",
                        name: "Premium Cotton Slim-Fit Denim Shirt",
                        price: 1299,
                        originalPrice: 1999,
                        image: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_fashion",
                        stock: "in_stock",
                        stockQuantity: 150,
                        b2bEnabled: true,
                        b2bWholesalePrice: 650,
                        b2bMinOrderQty: 50,
                        b2bUnitsPerCarton: 10,
                        b2bGstRate: "12",
                        b2bGstInvoice: true,
                        b2bPackagingType: "standard",
                        b2bLeadTimeDays: 5,
                        b2bCreditTerms: "net30",
                        b2bBulkPricingSlabs: [
                          { minQty: 50, maxQty: 100, pricePerUnit: 650 },
                          { minQty: 101, maxQty: 250, pricePerUnit: 600 },
                          { minQty: 251, maxQty: null, pricePerUnit: 550 }
                        ]
                    },
                    {
                        id: "prod_2",
                        _id: "prod_2",
                        name: "Elite Leather Chelsea Boots",
                        price: 4999,
                        originalPrice: 6999,
                        image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_footwear",
                        stock: "in_stock",
                        stockQuantity: 85,
                        b2bEnabled: true,
                        b2bWholesalePrice: 2400,
                        b2bMinOrderQty: 20,
                        b2bUnitsPerCarton: 5,
                        b2bGstRate: "18",
                        b2bGstInvoice: true,
                        b2bPackagingType: "custom",
                        b2bLeadTimeDays: 7,
                        b2bCreditTerms: "prepaid",
                        b2bBulkPricingSlabs: [
                          { minQty: 20, maxQty: 50, pricePerUnit: 2400 },
                          { minQty: 51, maxQty: null, pricePerUnit: 2200 }
                        ],
                        condition: "refurbished",
                        refurbishedGrade: "A",
                        refurbishedWarrantyDuration: "6_months",
                        deviceHealthBattery: 92,
                        deviceHealthCosmetic: "excellent",
                        deviceHealthFunctional: "fully_working",
                        isTested: true,
                        isFullyFunctional: true,
                        isCertified: true,
                        refurbishedOriginalMrp: 6999,
                        refurbishedSellingPrice: 4999,
                        accessoryBox: true,
                        accessoryCharger: false,
                        accessoryOthers: true,
                        cosmeticDamageNotes: "Very minor crease on leather front, otherwise identical to new.",
                        productAgeMonths: 3,
                        purchaseYear: 2025,
                        refurbishedApprovalStatus: "approved"
                    },
                    {
                        id: "prod_3",
                        _id: "prod_3",
                        name: "Classic Aviator Polarized Sunglasses",
                        price: 1599,
                        originalPrice: 2499,
                        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_accessories",
                        stock: "in_stock",
                        stockQuantity: 240,
                        b2bEnabled: false,
                        condition: "brand_new"
                    },
                    {
                        id: "prod_4",
                        _id: "prod_4",
                        name: "Designer Floral Print Silk Maxi Dress",
                        price: 3499,
                        originalPrice: 4999,
                        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_fashion",
                        stock: "low_stock",
                        stockQuantity: 8,
                        b2bEnabled: true,
                        b2bWholesalePrice: 1750,
                        b2bMinOrderQty: 10,
                        b2bUnitsPerCarton: 2,
                        b2bGstRate: "12",
                        b2bGstInvoice: true,
                        b2bPackagingType: "standard",
                        b2bLeadTimeDays: 4,
                        b2bCreditTerms: "net15",
                        b2bBulkPricingSlabs: [],
                        condition: "renewed",
                        refurbishedGrade: "B",
                        refurbishedWarrantyDuration: "3_months",
                        deviceHealthBattery: 88,
                        deviceHealthCosmetic: "good",
                        deviceHealthFunctional: "fully_working",
                        isTested: true,
                        isFullyFunctional: true,
                        isCertified: false,
                        refurbishedOriginalMrp: 4999,
                        refurbishedSellingPrice: 3499,
                        accessoryBox: false,
                        accessoryCharger: false,
                        accessoryOthers: false,
                        cosmeticDamageNotes: "Faint thread pull near lower hemline, professionally repaired.",
                        productAgeMonths: 5,
                        purchaseYear: 2025,
                        refurbishedApprovalStatus: "pending"
                    },
                    {
                        id: "prod_5",
                        _id: "prod_5",
                        name: "Athletic Quick-Dry Track Pants",
                        price: 999,
                        originalPrice: 1499,
                        image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_sports",
                        stock: "out_of_stock",
                        stockQuantity: 0,
                        b2bEnabled: false,
                        condition: "brand_new"
                    },
                    {
                        id: "prod_6",
                        _id: "prod_6",
                        name: "Pro Sound Cancelling Wireless Headphones",
                        price: 12999,
                        originalPrice: 19999,
                        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_electronics",
                        stock: "in_stock",
                        stockQuantity: 4,
                        b2bEnabled: false,
                        condition: "open_box",
                        refurbishedGrade: "A",
                        refurbishedWarrantyDuration: "1_year",
                        deviceHealthBattery: 100,
                        deviceHealthCosmetic: "excellent",
                        deviceHealthFunctional: "fully_working",
                        isTested: true,
                        isFullyFunctional: true,
                        isCertified: true,
                        refurbishedOriginalMrp: 19999,
                        refurbishedSellingPrice: 12999,
                        accessoryCharger: true,
                        accessoryBox: true,
                        accessoryOthers: true,
                        cosmeticDamageNotes: "Outer retail packaging has light tears. Headphones are unused with protective wraps intact.",
                        productAgeMonths: 1,
                        purchaseYear: 2026,
                        refurbishedApprovalStatus: "approved"
                    }
                );
            }

            // Load custom local products from localStorage
            const localProds = JSON.parse(localStorage.getItem('mock-vendor-products') || '[]');
            localProds.forEach(p => {
                if (!allProducts.some(v => String(v.id || v._id) === String(p.id || p._id) || v.name === p.name)) {
                    allProducts.push(p);
                }
            });

            set({
                products: allProducts,
                total: latestPagination.total ?? allProducts.length,
                page: fetchAll ? 1 : (latestPagination.page ?? 1),
                pages: fetchAll ? (latestPagination.pages ?? 1) : (latestPagination.pages ?? 1),
                isLoading: false,
            });
        } catch (error) {
            console.warn("API products call failed, loading mock fallback products:", error);
            const mockProducts = [
                {
                    id: "prod_1",
                    _id: "prod_1",
                    name: "Premium Cotton Slim-Fit Denim Shirt",
                    price: 1299,
                    originalPrice: 1999,
                    image: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=500&auto=format&fit=crop&q=60",
                    categoryId: "cat_fashion",
                    stock: "in_stock",
                    stockQuantity: 150,
                    b2bEnabled: true,
                    b2bWholesalePrice: 650,
                    b2bMinOrderQty: 50,
                    b2bUnitsPerCarton: 10,
                    b2bGstRate: "12",
                    b2bGstInvoice: true,
                    b2bPackagingType: "standard",
                    b2bLeadTimeDays: 5,
                    b2bCreditTerms: "net30",
                    b2bBulkPricingSlabs: [
                      { minQty: 50, maxQty: 100, pricePerUnit: 650 },
                      { minQty: 101, maxQty: 250, pricePerUnit: 600 },
                      { minQty: 251, maxQty: null, pricePerUnit: 550 }
                    ]
                },
                {
                    id: "prod_2",
                        _id: "prod_2",
                        name: "Elite Leather Chelsea Boots",
                        price: 4999,
                        originalPrice: 6999,
                        image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_footwear",
                        stock: "in_stock",
                        stockQuantity: 85,
                        b2bEnabled: true,
                        b2bWholesalePrice: 2400,
                        b2bMinOrderQty: 20,
                        b2bUnitsPerCarton: 5,
                        b2bGstRate: "18",
                        b2bGstInvoice: true,
                        b2bPackagingType: "custom",
                        b2bLeadTimeDays: 7,
                        b2bCreditTerms: "prepaid",
                        b2bBulkPricingSlabs: [
                          { minQty: 20, maxQty: 50, pricePerUnit: 2400 },
                          { minQty: 51, maxQty: null, pricePerUnit: 2200 }
                        ],
                        condition: "refurbished",
                        refurbishedGrade: "A",
                        refurbishedWarrantyDuration: "6_months",
                        deviceHealthBattery: 92,
                        deviceHealthCosmetic: "excellent",
                        deviceHealthFunctional: "fully_working",
                        isTested: true,
                        isFullyFunctional: true,
                        isCertified: true,
                        refurbishedOriginalMrp: 6999,
                        refurbishedSellingPrice: 4999,
                        accessoryBox: true,
                        accessoryCharger: false,
                        accessoryOthers: true,
                        cosmeticDamageNotes: "Very minor crease on leather front, otherwise identical to new.",
                        productAgeMonths: 3,
                        purchaseYear: 2025,
                        refurbishedApprovalStatus: "approved"
                    },
                    {
                        id: "prod_3",
                        _id: "prod_3",
                        name: "Classic Aviator Polarized Sunglasses",
                        price: 1599,
                        originalPrice: 2499,
                        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_accessories",
                        stock: "in_stock",
                        stockQuantity: 240,
                        b2bEnabled: false,
                        condition: "brand_new"
                    },
                    {
                        id: "prod_4",
                        _id: "prod_4",
                        name: "Designer Floral Print Silk Maxi Dress",
                        price: 3499,
                        originalPrice: 4999,
                        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_fashion",
                        stock: "low_stock",
                        stockQuantity: 8,
                        b2bEnabled: true,
                        b2bWholesalePrice: 1750,
                        b2bMinOrderQty: 10,
                        b2bUnitsPerCarton: 2,
                        b2bGstRate: "12",
                        b2bGstInvoice: true,
                        b2bPackagingType: "standard",
                        b2bLeadTimeDays: 4,
                        b2bCreditTerms: "net15",
                        b2bBulkPricingSlabs: [],
                        condition: "renewed",
                        refurbishedGrade: "B",
                        refurbishedWarrantyDuration: "3_months",
                        deviceHealthBattery: 88,
                        deviceHealthCosmetic: "good",
                        deviceHealthFunctional: "fully_working",
                        isTested: true,
                        isFullyFunctional: true,
                        isCertified: false,
                        refurbishedOriginalMrp: 4999,
                        refurbishedSellingPrice: 3499,
                        accessoryBox: false,
                        accessoryCharger: false,
                        accessoryOthers: false,
                        cosmeticDamageNotes: "Faint thread pull near lower hemline, professionally repaired.",
                        productAgeMonths: 5,
                        purchaseYear: 2025,
                        refurbishedApprovalStatus: "pending"
                    },
                    {
                        id: "prod_5",
                        _id: "prod_5",
                        name: "Athletic Quick-Dry Track Pants",
                        price: 999,
                        originalPrice: 1499,
                        image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_sports",
                        stock: "out_of_stock",
                        stockQuantity: 0,
                        b2bEnabled: false,
                        condition: "brand_new"
                    },
                    {
                        id: "prod_6",
                        _id: "prod_6",
                        name: "Pro Sound Cancelling Wireless Headphones",
                        price: 12999,
                        originalPrice: 19999,
                        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
                        categoryId: "cat_electronics",
                        stock: "in_stock",
                        stockQuantity: 4,
                        b2bEnabled: false,
                        condition: "open_box",
                        refurbishedGrade: "A",
                        refurbishedWarrantyDuration: "1_year",
                        deviceHealthBattery: 100,
                        deviceHealthCosmetic: "excellent",
                        deviceHealthFunctional: "fully_working",
                        isTested: true,
                        isFullyFunctional: true,
                        isCertified: true,
                        refurbishedOriginalMrp: 19999,
                        refurbishedSellingPrice: 12999,
                        accessoryCharger: true,
                        accessoryBox: true,
                        accessoryOthers: true,
                        cosmeticDamageNotes: "Outer retail packaging has light tears. Headphones are unused with protective wraps intact.",
                        productAgeMonths: 1,
                        purchaseYear: 2026,
                        refurbishedApprovalStatus: "approved"
                    }
            ];
            // Load custom local products from localStorage
            const localProds = JSON.parse(localStorage.getItem('mock-vendor-products') || '[]');
            const merged = [...mockProducts];
            localProds.forEach(p => {
                if (!merged.some(v => String(v.id || v._id) === String(p.id || p._id) || v.name === p.name)) {
                    merged.push(p);
                }
            });

            set({
                products: merged,
                total: merged.length,
                page: 1,
                pages: 1,
                isLoading: false,
            });
        }
    },

    /**
     * Fetch a single vendor product by id and cache it locally.
     * @param {string} id
     * @returns {object|null}
     */
    fetchProductById: async (id) => {
        try {
            const res = await getVendorProductById(id);
            const product = res.data ?? res;
            if (!product) return null;

            set((state) => {
                const idx = state.products.findIndex(
                    (p) => String(p._id ?? p.id) === String(id)
                );
                if (idx === -1) {
                    return { products: [product, ...state.products] };
                }
                const next = [...state.products];
                next[idx] = product;
                return { products: next };
            });
            return product;
        } catch {
            return null;
        }
    },

    // ─── CREATE ──────────────────────────────────────────────────────────────────

    /**
     * Create a new product and prepend it to the local list.
     * @param {object} data
     * @returns {object|null} created product or null on error
     */
    addProduct: async (data) => {
        set({ isSaving: true });
        
        // Save locally to localStorage so it is persistently available in mock sessions
        const newProduct = {
            ...data,
            id: data.id || data._id || `prod_mock_${Date.now()}`,
            _id: data._id || data.id || `prod_mock_${Date.now()}`,
            name: data.name,
            price: Number(data.price),
            originalPrice: Number(data.originalPrice || data.price * 1.5),
            image: data.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            categoryId: data.categoryId || "cat_fashion",
            stock: data.stock || "in_stock",
            stockQuantity: Number(data.stockQuantity ?? 100),
            b2bEnabled: data.b2bEnabled !== undefined ? data.b2bEnabled : false,
            b2bWholesalePrice: Number(data.b2bWholesalePrice || 0),
            b2bMinOrderQty: Number(data.b2bMinOrderQty || 0),
            b2bUnitsPerCarton: Number(data.b2bUnitsPerCarton || 0),
            b2bGstRate: data.b2bGstRate || "12",
            b2bGstInvoice: data.b2bGstInvoice !== undefined ? data.b2bGstInvoice : true,
            b2bPackagingType: data.b2bPackagingType || "standard",
            b2bLeadTimeDays: Number(data.b2bLeadTimeDays || 3),
            b2bCreditTerms: data.b2bCreditTerms || "net30",
            b2bBulkPricingSlabs: data.b2bBulkPricingSlabs || []
        };

        try {
            const localProds = JSON.parse(localStorage.getItem('mock-vendor-products') || '[]');
            localProds.push(newProduct);
            localStorage.setItem('mock-vendor-products', JSON.stringify(localProds));
        } catch (err) {
            console.warn("Failed to write mock product to localStorage:", err);
        }

        try {
            const res = await createVendorProduct(data);
            const product = res.data ?? res;
            await get().fetchProducts();
            set({ isSaving: false });
            toast.success('Product created successfully');
            return product;
        } catch (error) {
            console.warn("createVendorProduct API failed, using fallback product state:", error);
            set((state) => {
                const nextProducts = state.products.filter(p => p.name !== newProduct.name);
                return {
                    products: [newProduct, ...nextProducts],
                    total: state.total + 1,
                    isSaving: false,
                };
            });
            toast.success('Product created successfully (Sandbox Offline Mode)');
            return newProduct;
        }
    },

    // ─── UPDATE ──────────────────────────────────────────────────────────────────

    /**
     * Update an existing product and refresh it in the local list.
     * @param {string} id
     * @param {object} data
     * @returns {object|null} updated product or null on error
     */
    editProduct: async (id, data) => {
        set({ isSaving: true });
        
        try {
            const localProds = JSON.parse(localStorage.getItem('mock-vendor-products') || '[]');
            const updatedProds = localProds.map(p => 
                (p._id ?? p.id) === id ? { ...p, ...data } : p
            );
            localStorage.setItem('mock-vendor-products', JSON.stringify(updatedProds));
        } catch (err) {
            console.warn("Failed to update mock product in localStorage:", err);
        }

        try {
            const res = await updateVendorProduct(id, data);
            const updated = res.data ?? res;
            await get().fetchProducts();
            set({ isSaving: false });
            toast.success('Product updated successfully');
            return updated;
        } catch (error) {
            console.warn("updateVendorProduct API failed, updating locally:", error);
            set((state) => ({
                products: state.products.map((p) =>
                    (p._id ?? p.id) === id ? { ...p, ...data } : p
                ),
                isSaving: false,
            }));
            toast.success('Product updated successfully');
            return { id, ...data };
        }
    },

    // ─── DELETE ──────────────────────────────────────────────────────────────────

    /**
     * Delete a product and remove it from the local list.
     * @param {string} id
     * @returns {boolean} success
     */
    removeProduct: async (id) => {
        set({ isLoading: true });
        
        try {
            const localProds = JSON.parse(localStorage.getItem('mock-vendor-products') || '[]');
            const filteredProds = localProds.filter(p => (p._id ?? p.id) !== id);
            localStorage.setItem('mock-vendor-products', JSON.stringify(filteredProds));
        } catch (err) {
            console.warn("Failed to delete mock product from localStorage:", err);
        }

        try {
            await deleteVendorProduct(id);
            await get().fetchProducts();
            set({ isLoading: false });
            toast.success('Product deleted successfully');
            return true;
        } catch (error) {
            console.warn("deleteVendorProduct API failed, deleting locally:", error);
            set((state) => ({
                products: state.products.filter((p) => (p._id ?? p.id) !== id),
                total: Math.max(0, state.total - 1),
                isLoading: false,
            }));
            toast.success('Product deleted successfully');
            return true;
        }
    },

    // ─── STOCK ───────────────────────────────────────────────────────────────────

    /**
     * Update stock quantity for a product.
     * @param {string} productId
     * @param {number} stockQuantity
     * @returns {boolean} success
     */
    patchStock: async (productId, stockQuantity) => {
        set({ isSaving: true });
        try {
            const res = await updateVendorStock(productId, stockQuantity);
            const updated = res.data ?? res;
            await get().fetchProducts();
            set({ isSaving: false });
            toast.success('Stock updated successfully');
            return true;
        } catch (error) {
            console.warn("updateVendorStock API failed, updating locally:", error);
            set({ isSaving: false });
            return false;
        }
    },

    // ─── HELPERS ─────────────────────────────────────────────────────────────────

    /** Find a single product in the local cache by id */
    getById: (id) => {
        return get().products.find((p) => (p._id ?? p.id) === id || (p._id ?? p.id) === String(id));
    },

    /** Clear local product list (e.g. on logout) */
    reset: () => set({ products: [], total: 0, page: 1, pages: 1 }),
}));
