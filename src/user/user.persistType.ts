import { userTable } from 'src/db/schema'

export type UserPersistType = typeof userTable.$inferSelect
