import { useState, useEffect } from "react";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface Request {
  id: string;
  title: string;
  author: string;
  createdAt: number;
  published: boolean;
  auction: boolean;
}

interface RequestCardProps {
  headline: string;
  date: number;
  author: string;
}

const RequestCard = ({ headline, date, author }: RequestCardProps) => {
  return (
    <div
      style={{
        border: "1px solid #000",
        padding: "5px",
        margin: "5px",
      }}
    >
      <h3>{headline}</h3>
      <p>
        <strong>Date:</strong>
        {new Date(date * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
      <p>
        <strong>Author:</strong> {author}
      </p>
    </div>
  );
};

export const HomeView = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(
    null
  );
  const [pageInput, setPageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequestList = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/requests?page=${page}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setRequests(data.requests);
      setPaginationInfo(data.paginationInfo);
    } catch (error) {
      setError("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestList(1);
  }, []);

  return (
    <>
      <h1>Request List</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && requests?.length === 0 && <p>No requests</p>}
      {!loading && !error && requests?.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "5px",
          }}
        >
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              headline={request.title}
              date={request.createdAt}
              author={request.author}
            />
          ))}
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={() => fetchRequestList(paginationInfo!.currentPage - 1)}
          disabled={!paginationInfo || paginationInfo.currentPage === 1}
        >
          Prev
        </button>
        <div>current page: {paginationInfo?.currentPage ?? 1}</div>
        <button
          onClick={() => fetchRequestList(paginationInfo!.currentPage + 1)}
          disabled={
            !paginationInfo ||
            paginationInfo.currentPage === paginationInfo.totalPages
          }
        >
          Next
        </button>
      </div>
      <div>
        <h2>Testing</h2>
        <button onClick={() => fetchRequestList(1)}>First</button>
        <input
          type="number"
          placeholder="Enter page number"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onBlur={() => fetchRequestList(parseInt(pageInput))}
        />
        <button
          onClick={() => fetchRequestList(paginationInfo?.totalPages || 1)}
        >
          Last
        </button>
        <button onClick={() => setRequests([])}>[]</button>
        <pre>{JSON.stringify(paginationInfo, null, 2)}</pre>
      </div>
    </>
  );
};
