/**
 * Extracts a user-friendly error message from an Axios error response.
 * Checks for detail, then message, then falls back to the provided default.
 */
export function extractErrorMessage(err, fallback = 'Something went wrong.') {
  return err?.response?.data?.detail
    || err?.response?.data?.message
    || fallback;
}
