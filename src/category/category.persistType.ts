import { categoryTable } from 'src/db/schema'

export type CategoryPersistType = typeof categoryTable.$inferSelect
