import { RuleRegistry } from "../rules/rule-registry";
import { RuleLink } from "../rulesets/rule-link";
import { IFieldErrorProcessor } from "./ifield-error-processor";
export declare class FieldErrorProcessor implements IFieldErrorProcessor {
    ruleRegistry: RuleRegistry;
    constructor(ruleRegistry: RuleRegistry);
    processRuleLink(model: any, propname: any, ruleLink: RuleLink): Promise<any>;
    checkFieldForErrors(model: any, propname: any, rules: any): Promise<string>;
}
