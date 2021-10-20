import { Survey } from "../../survey.model";

export class SurveyResponse
{  
    survey : Survey;
    errors : string[];
    success : boolean;
}