/**
 * Make some properties optional on type T
 *
 * @example
 * ```typescript
 * type Post {
 * id: string;
 * title: string;
 * createdAt: Date;
 * }
 *
 * Optional<Post, 'id' | 'createdAt'>
 * ```
 **/

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
