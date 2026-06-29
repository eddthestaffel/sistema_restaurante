const parsePagination = (query, { defaultLimit = 10, maxLimit = 100 } = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const buildPaginatedResponse = (rows, count, { page, limit }) => ({
  data: rows,
  pagination: {
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit) || 1,
  },
});

module.exports = { parsePagination, buildPaginatedResponse };
