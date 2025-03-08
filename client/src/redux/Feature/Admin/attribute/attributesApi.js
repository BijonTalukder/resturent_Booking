import baseApi from '../../../Api/baseApi';

const attributesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Add Attributes
    addAttributes: builder.mutation({
      query: (data) => ({
        url: "/attributes/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['attributes'],
    }),



    // Get Attributes
    getAttributes: builder.query({
      query: () => ({
        url: "/attributes",
      }),
      providesTags: ['attributes'],
    }),

    // Update Attributes
    updateAttributes: builder.mutation({
      query: ({ id, data }) => ({
        url: `/attributes/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['attributes'],
    }),

   

    // Delete Attributes
    deleteAttributes: builder.mutation({
      query: (id) => ({
        url: `/attributes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['attributes'],
    }),


  }),
});

export const {
  useAddAttributesMutation,
  useGetAttributesQuery,
  useUpdateAttributesMutation,
  useDeleteAttributesMutation,

} = attributesApi;
