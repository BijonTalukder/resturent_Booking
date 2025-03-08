import baseApi from '../../../Api/baseApi';

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Category
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/category/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags:['categories']
    }),

    // Get Categories
    getCategory: builder.query({
      query: () => ({
        url: "/category",
      }),
      providesTags:['categories']
  
    }),

    // Update Category
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags:['categories']
     
    }),

    // Delete Category mutation in RTK Query
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['categories']
      
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
