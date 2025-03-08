import baseApi from '../../../Api/baseApi';

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add User
    addUser: builder.mutation({
      query: (data) => ({
        url: "/users/create",
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['users'], // Invalidates users cache
    }),

    // Get Users
    getUsers: builder.query({
      query: () => ({
        url: "/users",
      }),
      providesTags: ['users'], // Provides users cache
    }),

    // Get User by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: ['users'], // Provides users cache
    }),

    // Update User
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['users'],
    }),

    // Delete User
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['users'],
    }),

    // Update Password
    updatePassword: builder.mutation({
      query: ({ id, newPassword, confirmPassword }) => ({
        url: `/users/password/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        method: "PUT",
        body: { newPassword, confirmPassword },
      }),
      invalidatesTags: ['users'], // Invalidates users cache
    }),
  }),
});

export const { 
  useAddUserMutation,
  useGetUsersQuery, 
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdatePasswordMutation,
} = usersApi;