import express, { Request, Response } from "express";
import cors from "cors";
import { getPaginatedRequests, getAllRequests, sortRequests } from "./requests";

export const app = express();
const port = 3001;

// Middlewares
app.use(cors());

// Routes
app.get("/requests", (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = 10;

  // console.log("Incoming query", {
  //   method: req.method,
  //   endpoint: req.originalUrl,
  //   page: page,
  //   limit: limit,
  // });
  try {
    const unsortedRequests = getAllRequests();
    // console.log("Fetched all requests", {
    //   requestCount: unsortedRequests.length,
    // });

    const sortedRequests = sortRequests(unsortedRequests);
    // console.log("Sorted requests");

    const paginatedRequests = getPaginatedRequests(sortedRequests, limit);
    // console.log("Paginated requests", {
    //   totalPages: paginatedRequests.length,
    // });

    if (page > paginatedRequests.length) {
      // console.log("Page number out of range", {
      //   requestedPage: page,
      //   totalPages: paginatedRequests.length,
      // });
      return res.status(400).json({ error: "Page number out of range" });
    }

    const paginationInfo = {
      currentPage: page,
      totalPages: paginatedRequests.length,
      totalItems: sortedRequests.length,
    };

    // console.log("Query successfully processed", {
    //   currentPage: page,
    //   totalItems: sortedRequests.length,
    // });

    res
      .status(200)
      .json({ requests: paginatedRequests[page - 1], paginationInfo });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error });
  }
});

// App start
app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});
