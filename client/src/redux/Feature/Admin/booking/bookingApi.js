import baseApi from '../../../Api/baseApi';

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Booking
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/booking/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['booking'], // Invalidates booking cache
    }),

    // Get All Bookings
    getBookings: builder.query({
      query: () => ({
        url: "/booking",
      }),
      providesTags: ['booking'], // Provides booking cache
    }),

    // Get Single User's Bookings
    getUserBookings: builder.query({
      query: (userId) => ({
        url: `/booking/user/${userId}`,
      }),
      providesTags: ['booking'], // Provides booking cache
    }),

    // Get Booking Details
    getBookingDetails: builder.query({
      query: (id) => ({
        url: `/booking/${id}`,
      }),
      providesTags: ['booking'], // Provides booking cache
    }),

    // Update Booking
    updateBooking: builder.mutation({
      query: ({ id, data }) => ({
        url: `/booking/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['booking']
    }),

    // Cancel Booking
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['booking'], // Invalidates booking cache
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingsQuery,
  useGetUserBookingsQuery,
  useGetBookingDetailsQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApi;