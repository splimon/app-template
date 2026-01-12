export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  NO_SESSION: new AppError('NO_SESSION', 401, 'No session cookie found. Please log in.'),
  INVALID_CREDENTIALS: new AppError('INVALID_CREDENTIALS', 401, 'Invalid credentials. Please try again.'),
  TOO_MANY_REQUESTS: new AppError('TOO_MANY_REQUESTS', 429, 'Too many requests. Please try again later.'),

  ADMIN_REQUIRED: new AppError('ADMIN_REQUIRED', 403, 'Unauthorized: Admin access required.'),
  UNAUTHORIZED: new AppError('UNAUTHORIZED', 401, 'Unauthorized access. Please log in.'),
  CLIENTS_NOT_FOUND: new AppError('CLIENTS_NOT_FOUND', 404, 'No clients found.'), // shouldnt happen

  REPORT_NOT_FOUND: new AppError('REPORT_NOT_FOUND', 404, 'No report found.'),
  SITES_NOT_FOUND: new AppError('SITES_NOT_FOUND', 404, 'No sample sites found for the report.'),
  METRICS_NOT_FOUND: new AppError('METRICS_NOT_FOUND', 404, 'No metrics found for the report.'),
  RANGES_NOT_FOUND: new AppError('RANGES_NOT_FOUND', 404, 'No metric ranges found for the report.'),
} as const;