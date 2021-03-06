import { IValidationRule } from "./ivalidation-rule";
import { ModelHelper } from "../model-helper";
export declare class RequiredValidationRule implements IValidationRule {
    ruleName: string;
    validate(modelHelper: ModelHelper, propertyName: string, isRequired?: boolean): Promise<boolean>;
    getMessage(modelHelper: ModelHelper, propertyName: string, isRequired: any): string;
}
