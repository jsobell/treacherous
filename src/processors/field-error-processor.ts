import {RuleRegistry} from "../rules/rule-registry";
import {RuleLink} from "../rulesets/rule-link";
import {FieldHasError} from "./field-has-error";
import {IFieldErrorProcessor} from "./ifield-error-processor";

export class FieldErrorProcessor implements IFieldErrorProcessor
{
    constructor(public ruleRegistry: RuleRegistry){}

    public processRuleLink(model: any, fieldValue: any, ruleLink: RuleLink): Promise<any>{

        var shouldRuleApply = ruleLink.appliesIf === true
            || ((typeof(ruleLink.appliesIf) === "function")
                ? ruleLink.appliesIf(model, fieldValue, ruleLink.ruleOptions)
                : false);

        if (!shouldRuleApply)
        { return Promise.resolve(); }

        var validator = this.ruleRegistry.getRuleNamed(ruleLink.ruleName);

        var checkIfValid = (isValid) => {
            if(!isValid) {
                var error;
                if(ruleLink.messageOverride)
                {
                    if(typeof(ruleLink.messageOverride) === "function")
                    { error = (<((value: any, ruleOptions?: any) => string)>(ruleLink.messageOverride))(fieldValue, ruleLink.ruleOptions); }
                    else
                    { error = ruleLink.messageOverride; }
                }
                else
                { error = validator.getMessage(fieldValue, ruleLink.ruleOptions); }

                throw new FieldHasError(error);
            }
            return Promise.resolve();
        };

        return validator
            .validate(fieldValue, ruleLink.ruleOptions)
            .then(checkIfValid);
    }

    public checkFieldForErrors(model: any, fieldValue: any, rules: any): Promise<string>
    {
        var ruleCheck = (ruleLinkOrSet: any): Promise<any>  => {
            return this.processRuleLink(model, fieldValue, ruleLinkOrSet);
        };

        var checkEachRule = (rules: any) => {
            var promises = [];
            rules.forEach((rule) => {
                promises.push(ruleCheck(rule));
            });
            return Promise.all(promises);
        }

        return Promise.resolve(rules)
            .then(checkEachRule)
            .then(function(){ return null; })
            .catch((validationError) => {
                return validationError.message;
            });
    }
}