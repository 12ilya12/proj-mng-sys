import { ApiProperty } from '@nestjs/swagger'

export class RegistrationStatus {
  @ApiProperty()
  success: boolean
  @ApiProperty()
  message: string
}
