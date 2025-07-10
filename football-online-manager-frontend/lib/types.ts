export interface AppError {
  message: string;
  status?: number;
  details?: unknown; // Optional field for additional details
}