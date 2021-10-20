import { Interaction } from "./interaction.model";

export class InteractionResponse
{
    interaction : Interaction;
    interactions : Interaction[];
    count : number;
    errors : string[];
    success : boolean;
}