import { IsNotEmpty, IsNumberString } from "class-validator"

export class CreateDependencyDto {
    @IsNumberString()
    @IsNotEmpty()
    childTaskId: number;
}