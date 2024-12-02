## Notes:

- Logs are commented out in the backend to prevent clogging during testing.
- A test section was left in the UI to easily trigger certain states.
- Tried to maintain folder structure so you can easily see what I added and there aren't a bunch of folders with single files to search through.
- Make sure to run `npm install` as I added a few more dependencies, other commands are the same.

## Potential Improvements:

- **Naming Conventions:** The naming can be improved to avoid confusion, especially with API requests for an array of `Request` objects.
- **Loading State:** Add a loading state for the entire page to avoid awkward state when the number of pages is unknown.
- **Generic Sorting:** Implement more generic sorting on requests, allowing for multiple sorting keys.
- **User Pagination Settings:** Fully implement user-defined `LIMIT` for pagination.
- **Middleware for Validation & Sanitisation:** Add middleware to handle validation and sanitisation for the backend.
- **More Specific Error Handling:** Provide more specific errors to the frontend and handle them more gracefully.
- **API Documentation:** Write detailed documentation for the `/requests` endpoint.
