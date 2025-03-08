import baseApi from '../../../Api/baseApi';

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Brand
    addBrand: builder.mutation({
      query: (data) => ({
        url: "/brand/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['brands']
    }),

    // Get Brands
    getBrand: builder.query({
      query: () => ({
        url: "/brand",
      }),
      providesTags: ['brands']
    }),

    // Update Brand
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brand/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['brands']
    }),

    // Delete Brand mutation in RTK Query
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['brands']
    }),
  }),
});

export const {
  useAddBrandMutation,
  useGetBrandQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
