export const calculatePagination = (
  page: number = 1,
  limit: number = 10
): { skip: number; take: number } => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

export const validatePaginationParams = (
  page?: string | number,
  limit?: string | number
): { page: number; limit: number } => {
  const parsedPage = typeof page === "string" ? parseInt(page, 10) : page;
  const parsedLimit = typeof limit === "string" ? parseInt(limit, 10) : limit;

  return {
    page: parsedPage && parsedPage > 0 ? parsedPage : 1,
    limit:
      parsedLimit && parsedLimit > 0 && parsedLimit <= 100 ? parsedLimit : 10,
  };
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
