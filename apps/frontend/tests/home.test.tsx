import { render, screen, waitFor } from "@testing-library/react";
import { HomeView } from "../views/home";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Loading, no requests and error state handled correctly", () => {
  test("displays `Loading...` when fetching data", async () => {
    const mockResponse = new Response(JSON.stringify({}), { status: 200 });
    const mockFetch = jest.fn(() => Promise.resolve(mockResponse));
    global.fetch = mockFetch;

    render(<HomeView />);

    await waitFor(() =>
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("displays `Error` on fetch failure", async () => {
    const mockFetch = jest.fn(() =>
      Promise.reject(new Error("Failed to fetch"))
    );
    global.fetch = mockFetch;

    render(<HomeView />);

    await waitFor(() => expect(screen.getByText("Error")).toBeInTheDocument());
    expect(mockFetch).toHaveBeenCalledTimes(1);

    mockFetch.mockRestore();
  });

  test("displays `No requests` when there are no requests returned", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          requests: [],
          paginationInfo: { currentPage: 1, totalPages: 1, totalItems: 0 },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<HomeView />);

    await waitFor(() =>
      expect(screen.getByText("No requests")).toBeInTheDocument()
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);

    mockFetch.mockRestore();
  });
});

describe("Pagination", () => {
  test("displays the current page number", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          requests: [
            {
              id: "11",
              title: "Request 11",
              author: "Author 11",
              createdAt: 1680000000,
              published: true,
              auction: true,
            },
          ],
          paginationInfo: { currentPage: 2, totalPages: 2, totalItems: 11 },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<HomeView />);

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText("current page: 2")).toBeInTheDocument()
    );
  });

  test("displays the current page number", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          requests: [
            {
              id: "11",
              title: "Request 11",
              author: "Author 11",
              createdAt: 1680000000,
              published: true,
              auction: true,
            },
          ],
          paginationInfo: { currentPage: 2, totalPages: 2, totalItems: 11 },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<HomeView />);

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText("current page: 2")).toBeInTheDocument()
    );
  });

  test("previous and next buttons disabled on first/last page", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          requests: [
            {
              id: "1",
              title: "Request 1",
              author: "Author 1",
              createdAt: 1680000000,
              published: true,
              auction: true,
            },
          ],
          paginationInfo: { currentPage: 1, totalPages: 1, totalItems: 1 },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<HomeView />);

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );

    const prevButton = screen.getByText("Prev");
    expect(prevButton).toBeDisabled();

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });
});
