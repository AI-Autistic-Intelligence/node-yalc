/**
 * Base marker interface for HTTP Controllers.
 * Implement this interface to ensure standardized dependency injection scanning for REST/GraphQL endpoints.
 */
export interface IController {}

/**
 * Base marker interface for GraphQL Resolvers.
 */
export interface IResolver {}

/**
 * Base marker interface for Business Logic Services.
 * Classes implementing this interface contain core domain logic and are instantiated by the framework's IoC container.
 */
export interface IService {}

/**
 * Base marker interface for Generic Providers (e.g., Factories, Repositories).
 */
export interface IProvider {}
