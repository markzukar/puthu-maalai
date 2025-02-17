import { createSlice } from "@reduxjs/toolkit";

const singleProductSlice = createSlice({
    name: 'single Product',
    initialState: {
        loading: false,
        singleProduct: {},
        isProductCreated: false,
        isProductDeleted: false

    },
    reducers: {
        singleProductRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        singleProductSuccess(state, action) {
            return {
                ...state,
                loading: false,
                singleProduct: action.payload.product
            }
        },
        singleProductFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        createProductRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        createProductSuccess(state, action) {
            return {
                ...state,
                loading: false,
                Product: action.payload.product,
                isProductCreated: true
            }
        },
        createProductFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
                isProductCreated: false

            }
        },
        clearProductCreated(state, action) {
            return {
                ...state,
                isProductCreated: false
            }
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        },
        deleteProductRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        deleteProductSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isProductDeleted: true
            }
        },
        deleteProductFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
                isProductDeleted: false

            }
        },
        clearProductDeleted(state, action) {
            return {
                ...state,
                isProductDeleted: false
            }
        }
    }
})

const { actions, reducer } = singleProductSlice

export const {
    singleProductFail,
    singleProductRequest,
    singleProductSuccess,
    clearProductCreated,
    createProductFail,
    createProductRequest,
    createProductSuccess,
    clearError,
    deleteProductFail,
    deleteProductRequest,
    deleteProductSuccess,
    clearProductDeleted

} = actions
export default reducer;