import {ModelHelper} from "../model-helper";
;
import {IValidationRule} from "./ivalidation-rule";

export class ISODateValidationRule implements IValidationRule
{
    public ruleName = "isoDate";
    private isoDateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

    public validate(modelHelper:ModelHelper, propertyName:string): Promise<boolean>
    {
        var value = modelHelper.resolve(propertyName);
        if (value === undefined || value === null)
        { return Promise.resolve(true); }

        var matchesRegex = this.isoDateRegex.test(value);
        return Promise.resolve(matchesRegex);
    }

    public getMessage(modelHelper:ModelHelper, propertyName:string) {
        var value = modelHelper.resolve(propertyName);
        return `This field contains "${value}" which is not a valid ISO date`;
    }
}