export interface Student {
  id: number;
  name: string;
  course: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface LogEntry {
  id: string;
  timestamp: string;
  method: HttpMethod;
  url: string;
  statusCode: number;
  statusText: string;
  message?: string;
  responseTimeMs: number;
}

export interface ApiResponse {
  statusCode: number;
  statusText: string;
  data: any;
  timestamp: string;
  durationMs: number;
}

export type ActiveTab = 'students' | 'tester' | 'logger' | 'architecture';
