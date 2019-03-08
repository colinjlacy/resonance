export interface RequestResponse<T> {
  error: boolean;
  status: number;
  message?: string;
  data: T;
}
