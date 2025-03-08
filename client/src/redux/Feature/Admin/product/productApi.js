import baseApi from '../../../Api/baseApi';

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Product
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/product/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['products']
    }),

    // Get Products
    getProducts: builder.query({
      query: () => ({
        url: "/allProduct",
      }),
      providesTags: ['products']
    }),

    // Get Products with search, pagination, and price filtering
    getProductsBySearch: builder.query({
      query: ({ search = '', page, limit, priceMin, priceMax, category, brand , sortBy }) => ({
        url: "/product",
        params: {
          search,
          page,
          limit,
          priceMin,
          priceMax,
          category,
          brand,
          sortBy
        },
      }),
      providesTags: ['products']
    }),

    // Get Products by Id
    getProductsById: builder.query({
      query: (id) => ({
        url: `/product/${id}`,
      }),
      providesTags: ['products']
    }),

    // Get Related Products
    getRelatedProducts: builder.query({
      query: (id) => ({
        url: `/relatedProducts/${id}`,
      }),
      providesTags: ['products']
    }),

    // Update Product
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['products']
    }),

    // Delete Product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['products']
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
  useGetProductsBySearchQuery,
  useGetProductsByIdQuery,
  useGetRelatedProductsQuery, // Export the new query hook
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

export default productApi;