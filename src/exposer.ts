import {ValidationGroupFactory} from "./factories/validation-group-factory";
import {FieldErrorProcessor} from "./processors/field-error-processor";
import {RuleRegistry} from "./rules/rule-registry";
import {Ruleset} from "./rulesets/ruleset";
import {DateValidationRule} from "./rules/date-validation-rule";
import {DecimalValidationRule} from "./rules/decimal-validation-rule";
import {EmailValidationRule} from "./rules/email-validation-rule";
import {EqualValidationRule} from "./rules/equal-validation-rule";
import {ISODateValidationRule} from "./rules/iso-date-validation-rule";
import {MaxLengthValidationRule} from "./rules/max-length-validation-rule";
import {MaxValueValidationRule} from "./rules/max-value-validation-rule";
import {MinLengthValidationRule} from "./rules/min-length-validation-rule";
import {MinValueValidationRule} from "./rules/min-value-validation-rule";
import {NotEqualValidationRule} from "./rules/not-equal-validation-rule";
import {NumberValidationRule} from "./rules/number-validation-rule";
import {RegexValidationRule} from "./rules/regex-validation-rule";
import {RequiredValidationRule} from "./rules/required-validation-rule";
import {StepValidationRule} from "./rules/step-validation-rule";
import {RulesetBuilder} from "./rulesets/ruleset-builder";
import {ValidationGroup} from "./validation-group";
import {PropertyResolver} from "property-resolver";
import {RuleResolver} from "./rulesets/rule-resolver";
import {ValidationSettings} from "./validation-settings";
import {ModelWatcher} from "./watcher/model-watcher";
import {IValidationSettings} from "./ivalidation-settings";

export var ruleRegistry = new RuleRegistry();
ruleRegistry.registerRule(new DateValidationRule());
ruleRegistry.registerRule(new DecimalValidationRule());
ruleRegistry.registerRule(new EmailValidationRule());
ruleRegistry.registerRule(new EqualValidationRule());
ruleRegistry.registerRule(new ISODateValidationRule());
ruleRegistry.registerRule(new MaxLengthValidationRule());
ruleRegistry.registerRule(new MaxValueValidationRule());
ruleRegistry.registerRule(new MinLengthValidationRule());
ruleRegistry.registerRule(new MinValueValidationRule());
ruleRegistry.registerRule(new NotEqualValidationRule());
ruleRegistry.registerRule(new NumberValidationRule());
ruleRegistry.registerRule(new RegexValidationRule());
ruleRegistry.registerRule(new RequiredValidationRule());
ruleRegistry.registerRule(new StepValidationRule());

var fieldErrorProcessor = new FieldErrorProcessor(ruleRegistry);
var ruleResolver = new RuleResolver();
var validationGroupFactory = new ValidationGroupFactory(fieldErrorProcessor, ruleResolver);

export function createRuleset(): RulesetBuilder
{
    return new RulesetBuilder().create();
}

export function createGroupWithRules(model: any, rulesCreator: (rulesetBuilder: RulesetBuilder) => Ruleset, settings?:IValidationSettings): ValidationGroup
{
    var ruleset = rulesCreator(new RulesetBuilder());
    return validationGroupFactory.createValidationGroup(model, ruleset, settings || DefaultValidationSettings) as ValidationGroup;
}

export function createGroup(model: any, ruleset: Ruleset, settings?:IValidationSettings): ValidationGroup
{
    return validationGroupFactory.createValidationGroup(model, ruleset, settings || DefaultValidationSettings) as ValidationGroup;
}

export var DefaultValidationSettings:ValidationSettings = new ValidationSettings()
    .configure(c => c
        .setModelWatcherFactory(() => new ModelWatcher())
        .setPropertyResolverFactory(() => new PropertyResolver())
    );
