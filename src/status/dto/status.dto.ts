import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class StatusDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}