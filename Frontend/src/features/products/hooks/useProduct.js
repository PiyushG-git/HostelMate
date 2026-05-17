import { createProduct, getSellerProduct, getAllProducts, getProductById, markProductAsSold, updateProduct, deleteProduct, getWatchlist, addToWatchlist, removeFromWatchlist } from "../service/product.api"
import { useDispatch } from "react-redux"
import { setSellerProducts, setProducts, setWatchlist } from "../state/product.slice"
import { useCallback } from "react"


export const useProduct = () => {

    const dispatch = useDispatch()

    const handleCreateProduct = useCallback(async (formData) => {
        const data = await createProduct(formData)
        return data.product
    }, [])

    const handleGetSellerProduct = useCallback(async () => {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products
    }, [dispatch])

    const handleGetAllProducts = useCallback(async ({ category, search } = {}) => {
        const data = await getAllProducts({ category, search })
        dispatch(setProducts(data.products))
    }, [dispatch])

    const handleGetProductById = useCallback(async (productId) => {
        const data = await getProductById(productId)
        return data.product
    }, [])

    const handleMarkAsSold = useCallback(async (productId) => {
        return await markProductAsSold(productId)
    }, [])

    const handleUpdateProduct = useCallback(async (productId, formData) => {
        const data = await updateProduct(productId, formData)
        return data.product
    }, [])

    const handleDeleteProduct = useCallback(async (productId) => {
        return await deleteProduct(productId)
    }, [])

    const handleGetWatchlist = useCallback(async () => {
        const data = await getWatchlist()
        dispatch(setWatchlist(data.watchlist))
        return data.watchlist
    }, [dispatch])

    const handleAddToWatchlist = useCallback(async (productId) => {
        const data = await addToWatchlist(productId)
        dispatch(setWatchlist(data.watchlist))
        return data.watchlist
    }, [dispatch])

    const handleRemoveFromWatchlist = useCallback(async (productId) => {
        const data = await removeFromWatchlist(productId)
        dispatch(setWatchlist(data.watchlist))
        return data.watchlist
    }, [dispatch])

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleGetProductById,
        handleMarkAsSold,
        handleUpdateProduct,
        handleDeleteProduct,
        handleGetWatchlist,
        handleAddToWatchlist,
        handleRemoveFromWatchlist,
    }

}