import baseApi from '../../../Api/baseApi';

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Order
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['orders'], // Invalidates orders cache
    }),

    // Get Orders
    getOrders: builder.query({
      query: () => ({
        url: "/orders",
      }),
      providesTags: ['orders'], // Provides orders cache
    }),

    // Get Single User Order
    getSingleOrder: builder.query({
      query: (id) => ({
        url: `/orders/user/${id}`,
      }),
      providesTags: ['orders'], // Provides orders cache
    }),

    // Trace Order
    traceOrder: builder.query({
      query: (id) => ({
        url: `/orders/trace/${id}`,
      }),
      providesTags: ['orders'], // Provides orders cache
    }),

    // Update Order
    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['orders']
    }),

    // Delete Order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['orders'], // Invalidates orders cache
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useTraceOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
