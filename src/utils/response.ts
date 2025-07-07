import { ApiResponse } from "../types";

export class ResponseUtil {
  static success<T>(data: T, message = "Success", meta?: any): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      ...(meta && { meta }),
    };
  }

  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      ...(error && { error }),
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message = "Data retrieved successfully"
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
