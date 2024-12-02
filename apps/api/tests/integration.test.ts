import superRequest from "supertest";
import {
  getPaginatedRequests,
  getAllRequests,
  sortRequests,
  Request,
} from "../requests";
import { app } from "../main";
import testRequests from "../requests-data.json";

jest.mock("../requests");

describe("GET /requests", () => {
  const mockRequests: Request[] = testRequests.slice(0, 10);

  beforeAll(() => {
    (getAllRequests as jest.Mock).mockReturnValue(mockRequests);
    (sortRequests as jest.Mock).mockReturnValue(mockRequests);
    (getPaginatedRequests as jest.Mock).mockReturnValue([[mockRequests]]);
  });

  test("should return 200 and paginated requests", async () => {
    const response = await superRequest(app).get("/requests?page=1");

    expect(response.status).toBe(200);
    expect(response.body.requests.length).toBe(1);
    expect(response.body.paginationInfo.currentPage).toBe(1);
    expect(response.body.paginationInfo.totalPages).toBe(1);
  });

  test("should handle invalid page number gracefully", async () => {
    const response = await superRequest(app).get("/requests?page=100");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Page number out of range");
  });

  test("should default to page 1 if no page query is provided", async () => {
    const response = await superRequest(app).get("/requests");

    expect(response.status).toBe(200);
    expect(response.body.paginationInfo.currentPage).toBe(1);
  });

  test("should default to page 1 if negative or non-numerical page query is provided", async () => {
    const response1 = await superRequest(app).get("/requests?page=-1000");

    expect(response1.status).toBe(200);
    expect(response1.body.paginationInfo.currentPage).toBe(1);

    const response2 = await superRequest(app).get("/requests?page=notanumber");

    expect(response2.status).toBe(200);
    expect(response2.body.paginationInfo.currentPage).toBe(1);
  });
});
