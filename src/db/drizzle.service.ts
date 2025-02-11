import { Inject, Injectable } from '@nestjs/common'
import { PG_CONNECTION } from '../db/drizzle.module'
import * as schema from '../db/schema'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

@Injectable()
export class DrizzleService {
  constructor(
    @Inject(PG_CONNECTION) readonly db: NodePgDatabase<typeof schema>
  ) {}
}
