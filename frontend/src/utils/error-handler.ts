export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

interface ApiErrorResponse {
  message: string;
  code?: string;
}

interface HttpError {
  response?: {
    status: number;
    data?: ApiErrorResponse;
  };
  message?: string;
}

export const handleServiceError = (error: HttpError | Error | unknown): AppError => {
  // Handle axios-style errors
  if (error && typeof error === 'object' && 'response' in error) {
    const httpError = error as HttpError;
    if (httpError.response?.data?.message) {
      return new AppError(
        httpError.response.data.message,
        httpError.response.status,
        httpError.response.data.code
      );
    }
  }
  
  // Handle standard JavaScript errors
  if (error instanceof Error && error.message) {
    return new AppError(error.message);
  }
  
  // Handle unknown errors
  return new AppError('An unexpected error occurred');
};