import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator"

export class CreateDependencyDto {
    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Идентификатор дочерней задачи', example: '12' })
    childTaskId: number;
}