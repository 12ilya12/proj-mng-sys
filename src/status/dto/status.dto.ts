import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class StatusDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Идентификатор статуса', example: '1' })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Название статуса', example: 'New' })
    name: string;
}