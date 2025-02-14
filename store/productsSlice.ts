import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

interface ProductsState {
    items: Product[];
    filteredItems: Product[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    searchQuery: string;
    selectedCategory: string;
    categories: string[];
}

const initialState: ProductsState = {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    currentPage: 1,
    searchQuery: '',
    selectedCategory: '',
    categories: [],
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        return data;
    }
);

export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async () => {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const data = await response.json();
        return data;
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            state.currentPage = 1;
            state.filteredItems = state.items.filter(item =>
                item.title.toLowerCase().includes(action.payload.toLowerCase()) &&
                (state.selectedCategory ? item.category === state.selectedCategory : true)
            );
        },
        setCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
            state.currentPage = 1;
            state.filteredItems = state.items.filter(item =>
                item.title.toLowerCase().includes(state.searchQuery.toLowerCase()) &&
                (action.payload ? item.category === action.payload : true)
            );
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.filteredItems = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            });
    },
});

export const { setSearchQuery, setCategory, setCurrentPage } = productsSlice.actions;
export default productsSlice.reducer; 