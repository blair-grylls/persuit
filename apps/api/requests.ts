import unsortedRequests from "./requests-data.json";

export interface Request {
  id: string;
  title: string;
  author: string;
  createdAt: number;
  published: boolean;
  auction: boolean;
}

export const getAllRequests = () => {
  return unsortedRequests;
};

export const sortRequests = (
  requests: Request[] = [],
  key: keyof Request = "createdAt",
  order: "asc" | "desc" = "desc"
): Request[] => {
  return requests.sort((a, b) => {
    switch (key) {
      case "createdAt":
        return order === "asc"
          ? a.createdAt - b.createdAt
          : b.createdAt - a.createdAt;
      default:
        return 0;
    }
  });
};

export const getPaginatedRequests = (
  requests: Request[],
  limit: number = 10
): Request[][] => {
  const paginatedRequests: Request[][] = [];

  for (let i = 0; i < requests.length; i += limit) {
    paginatedRequests.push(requests.slice(i, i + limit));
  }

  return paginatedRequests;
};
