import baseApi from "@/redux/Api/baseApi";
import { getTagsByModuleName } from "@/redux/Tag/Tag";

const productVariationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Product Unit
    addProductVariationApi: builder.mutation({
      query: (data) => ({
        url: "/product-variant/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: getTagsByModuleName('ProductVariationApi')
    }),

    // Get Product Units
    getProductVariationApi: builder.query({
      query: () => ({
        url: "/product-variant",
      }),
      providesTags: getTagsByModuleName('ProductVariationApi')
    }),

    // Get Single Product Unit by ID
    getProductVariationApiById: builder.query({
      query: (id) => ({
        url: `/product-variant/${id}`,
      }),
      providesTags: getTagsByModuleName('ProductVariationApi')

    }),

    // Update Product Unit
    updateProductVariationApi: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product-variant/update/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: getTagsByModuleName('ProductVariationApi')

    }),

    // Delete Product Unit
    deleteProductVariationApi: builder.mutation({
      query: (id) => ({
        url: `/product-variant/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: getTagsByModuleName('ProductVariationApi')

    }),
  }),
});

export const {
  useAddProductVariationApiMutation,
  useGetProductVariationApiQuery,
  useGetProductVariationApiByIdQuery, 
  useUpdateProductVariationApiMutation,
  useDeleteProductVariationApiMutation,
} = productVariationApi;

export default productVariationApi;
