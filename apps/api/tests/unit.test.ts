import { Request, sortRequests, getPaginatedRequests } from "../requests";
import testRequests from "../requests-data.json";

describe("sortRequests", () => {
  const requests: Request[] = testRequests.slice(0, 3);

  test("should sort requests by createdAt in descending order by default", () => {
    const sorted = sortRequests(requests);

    expect(sorted[0]!.author).toBe("Michael Williams");
    expect(sorted[1]!.author).toBe("Elizabeth Hernandez");
    expect(sorted[2]!.author).toBe("Linda Rodriguez");
  });

  test("should sort requests by createdAt in ascending order when specified", () => {
    const sorted = sortRequests(requests, "createdAt", "asc");

    expect(sorted[0]!.author).toBe("Linda Rodriguez");
    expect(sorted[1]!.author).toBe("Elizabeth Hernandez");
    expect(sorted[2]!.author).toBe("Michael Williams");
  });

  test("should handle empty request array", () => {
    const sorted = sortRequests([]);

    expect(sorted.length).toBe(0);
  });
});

describe("getPaginatedRequests", () => {
  const requests: Request[] = testRequests.slice(0, 11);

  test("should paginate requests with a limit of 10 items per page by default", () => {
    const paginatedRequests = getPaginatedRequests(requests);

    expect(paginatedRequests.length).toBe(2);
    expect(paginatedRequests[0]!.length).toBe(10);
    expect(paginatedRequests[1]!.length).toBe(1);
  });

  test("should paginate requests with a limit of 5 items per page when specified", () => {
    const paginatedRequests = getPaginatedRequests(requests, 5);

    expect(paginatedRequests.length).toBe(3);
    expect(paginatedRequests[0]!.length).toBe(5);
    expect(paginatedRequests[1]!.length).toBe(5);
    expect(paginatedRequests[2]!.length).toBe(1);
  });

  test("should handle empty request array", () => {
    const paginatedRequests = getPaginatedRequests([]);

    expect(paginatedRequests.length).toBe(0);
  });
});
