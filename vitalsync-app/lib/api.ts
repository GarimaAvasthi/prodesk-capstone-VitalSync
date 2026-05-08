/**
 * API utilities for handling requests and responses
 * Provides standardized request/response handling and error management
 */

import { APIResponse, APIError } from '@/types';
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from './errors';
import { logger } from './logger';

/**
 * Configuration for API requests
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

/**
 * Make an API request with error handling
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit & RequestConfig = {}
): Promise<APIResponse<T>> {
  const {
    headers = {},
    timeout = 30000,
    retries = 3,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      const error: APIError = {
        code: data?.error?.code || ERROR_CODES.API_ERROR,
        message: data?.error?.message || 'API request failed',
        details: data?.error?.details,
      };

      return {
        success: false,
        error,
        timestamp: new Date(),
      };
    }

    return {
      success: true,
      data,
      timestamp: new Date(),
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: ERROR_CODES.TIMEOUT_ERROR,
          message: 'Request timed out. Please try again.',
        },
        timestamp: new Date(),
      };
    }

    logger.error(`API request failed: ${error.message}`, 'api');

    return {
      success: false,
      error: {
        code: ERROR_CODES.NETWORK_ERROR,
        message: error.message || 'Network error occurred',
      },
      timestamp: new Date(),
    };
  }
}

/**
 * Make a GET request
 */
export async function apiGet<T>(
  url: string,
  config?: RequestConfig
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...config,
    method: 'GET',
  });
}

/**
 * Make a POST request
 */
export async function apiPost<T>(
  url: string,
  body: any,
  config?: RequestConfig
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...config,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Make a PUT request
 */
export async function apiPut<T>(
  url: string,
  body: any,
  config?: RequestConfig
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...config,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * Make a PATCH request
 */
export async function apiPatch<T>(
  url: string,
  body: any,
  config?: RequestConfig
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...config,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/**
 * Make a DELETE request
 */
export async function apiDelete<T>(
  url: string,
  config?: RequestConfig
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, {
    ...config,
    method: 'DELETE',
  });
}

/**
 * API response handler
 */
export function handleApiResponse<T>(
  response: APIResponse<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: APIError) => void
): T | null {
  if (response.success && response.data) {
    onSuccess?.(response.data);
    return response.data;
  }

  if (response.error) {
    onError?.(response.error);
    logger.error(`API error: ${response.error.message}`, 'api', {
      code: response.error.code,
      details: response.error.details,
    });
  }

  return null;
}

/**
 * Create API error response for Next.js API routes
 */
export function apiErrorResponse(
  code: string,
  message: string,
  statusCode: number = 500
) {
  return {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date(),
  };
}

/**
 * Create successful API response for Next.js API routes
 */
export function apiSuccessResponse<T>(data: T) {
  return {
    success: true,
    data,
    timestamp: new Date(),
  };
}
