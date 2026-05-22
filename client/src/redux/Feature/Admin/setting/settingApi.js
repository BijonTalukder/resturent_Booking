import baseApi from '../../../Api/baseApi';

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upsertSetting: builder.mutation({
      query: ({ key, value }) => ({
        url: "/setting/upsert",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: { key, value },
      }),
      invalidatesTags: ['setting'],
    }),

    getSetting: builder.query({
      query: (key) => ({
        url: `/setting/${key}`,
      }),
      providesTags: ['setting'],
    }),

    getAllSettings: builder.query({
      query: () => ({
        url: "/setting",
      }),
      providesTags: ['setting'],
    }),
  }),
});

export const {
  useUpsertSettingMutation,
  useGetSettingQuery,
  useGetAllSettingsQuery,
} = settingApi;
