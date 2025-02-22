import { taskTable } from 'src/db/schema'

export type TaskPersistType = typeof taskTable.$inferSelect
