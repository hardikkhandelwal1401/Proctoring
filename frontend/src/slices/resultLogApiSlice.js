import { apiSlice } from './apiSlice';

// Define the base URL for the exams API
const EXAMS_URL = '/api/users';

// Inject endpoints for the exam slice
export const resultLogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get cheating logs for a specific exam
    getResultLogs: builder.query({
      query: (examId) => ({
        url: `${EXAMS_URL}/result/${examId}`, // Updated route
        method: 'GET',
      }),
    }),
    // Save a new cheating log entry for an exam
    saveResultLog: builder.mutation({
      query: (data) => ({
        url: `${EXAMS_URL}/result`, // Updated route
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export the generated hooks for each endpoint
export const { useGetResultLogsQuery, useSaveResultLogMutation } = resultLogApiSlice;