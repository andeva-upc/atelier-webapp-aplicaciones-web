/**
 * @file base-response.js
 * Infrastructure layer definitions for standard network resource structures (DTOs) and responses.
 * 
 * These definitions serve as the JavaScript equivalent of the BaseResource and BaseResponse 
 * TypeScript interfaces.
 */

/**
 * Minimal structure of a network resource (DTO).
 * Every backend resource mapped to this infrastructure must have at least an ID
 * and a workshop_id for multi-tenancy.
 * 
 * @typedef {Object} BaseResource
 * @property {string|number} id - The unique identifier of the resource.
 * @property {string} workshop_id - The tenant identifier.
 * @property {string|null} [deleted_at] - Optional soft-delete timestamp.
 */

/**
 * Represents a wrapped response format (e.g., paginated metadata, envelope formats).
 * 
 * @typedef {Object} BaseResponse
 */

// Empty exports to satisfy module resolution and provide a target for JSDoc documentation.
export const BaseResource = {};
export const BaseResponse = {};
