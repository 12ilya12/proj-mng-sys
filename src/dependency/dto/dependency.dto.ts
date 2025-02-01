import { IsNotEmpty, IsNumber } from "class-validator"

export class DependencyDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    parentTaskId: number;

    @IsNumber()
    childTaskId: number;
}