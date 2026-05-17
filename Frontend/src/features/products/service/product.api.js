import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

const authApiInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData)
    return response.data
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller")
    return response.data
}

export async function getAllProducts({ category = '', search = '' } = {}) {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    const response = await productApiInstance.get("/", { params })
    return response.data
}

export async function getProductById(productId) {
    const response = await productApiInstance.get(`/detail/${productId}`)
    return response.data
}

export async function markProductAsSold(productId) {
    const response = await productApiInstance.patch(`/${productId}/sold`)
    return response.data
}

export async function updateProduct(productId, data) {
    const isFormData = data instanceof FormData;
    const response = await productApiInstance.put(`/${productId}`, data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    })
    return response.data
}

export async function deleteProduct(productId) {
    const response = await productApiInstance.delete(`/${productId}`)
    return response.data
}

// ── Watchlist ──────────────────────────────────────────────

export async function getWatchlist() {
    const response = await authApiInstance.get("/watchlist")
    return response.data
}

export async function addToWatchlist(productId) {
    const response = await authApiInstance.post(`/watchlist/${productId}`)
    return response.data
}

export async function removeFromWatchlist(productId) {
    const response = await authApiInstance.delete(`/watchlist/${productId}`)
    return response.data
}