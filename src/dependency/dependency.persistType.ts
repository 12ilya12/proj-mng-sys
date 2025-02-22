import { dependencyTable } from 'src/db/schema'

export type DependencyPersistType =
  typeof dependencyTable.$inferSelect
