export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parsePagination(
  page?: string | number,
  limit?: string | number,
  maxLimit = 100
): PaginationParams {
  const parsedPage = Math.max(1, parseInt(String(page ?? 1), 10) || 1);
  const parsedLimit = Math.min(
    maxLimit,
    Math.max(1, parseInt(String(limit ?? 20), 10) || 20)
  );
  return { page: parsedPage, limit: parsedLimit };
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit) || 0,
    },
  };
}

export function getOffset(params: PaginationParams): number {
  return (params.page - 1) * params.limit;
}
