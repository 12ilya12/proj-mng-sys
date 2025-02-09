import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateStatusDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Название статуса', example: 'New' })
    name: string;
}