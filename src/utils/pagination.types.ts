export interface Pagination {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}