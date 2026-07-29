export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    currentPage: number;
    totalPages: number;
  };
}
