import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CategoryDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}