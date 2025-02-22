import { statusTable } from 'src/db/schema'

export type StatusPersistType = typeof statusTable.$inferSelect
