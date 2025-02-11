import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { Pool } from 'pg'

export const PG_CONNECTION = 'PG_CONNECTION'

@Module({
  providers: [
    //DrizzleService,
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const connectionString = config.get('DATABASE_URL')
        const pool = new Pool({
          connectionString,
          ssl: false
        })
        return drizzle(pool, { schema })
      }
    }
  ],
  exports: [PG_CONNECTION]
})
export class DrizzleModule {}
