import baseApi from '../../Api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: data,
      }),
    }),

    // Register a new user
    register: builder.mutation({
      query: (data) => ({
        url: "/users/create",
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['users'],
    }),

    // Get all users
    getUsers: builder.query({
      query: () => ({
        url: "/users",
      }),
      providesTags: ['users'],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: ['users'],
    }),

    // Update user
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

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['users'],
    }),

    // Verify email
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `/users/verify/${token}`,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetUsersQuery, 
  useGetUserByIdQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useVerifyEmailMutation 
} = authApi;