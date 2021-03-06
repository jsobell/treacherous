import {Ruleset} from "./ruleset";
import {RuleLink} from "./rule-link";
import {ForEachRule} from "./for-each-rule";
import {RuleRegistry} from "../rules/rule-registry";

export class RulesetBuilder
{
    private internalRuleset: Ruleset;
    public currentProperty: string;
    public currentRule:RuleLink;

    constructor(private ruleRegistry?: RuleRegistry) {}

    public create = (): RulesetBuilder =>
    {
        this.internalRuleset = new Ruleset();
        this.currentProperty = null;
        return this;
    }

    public forProperty = (propertyName: string): RulesetBuilder =>
    {
        this.currentProperty = propertyName;
        this.currentRule = null;
        return this;
    }

    public addRule = (rule: string, ruleOptions?: any): RulesetBuilder =>
    {
        if(rule == null || typeof(rule) == "undefined" || rule.length == 0)
        { throw new Error("A rule name is required"); }
        
        if(this.ruleRegistry && !this.ruleRegistry.hasRuleNamed(rule))
        { throw new Error(`The rule [${rule}] has not been registered`); }

        if(!this.currentProperty)
        { throw new Error("A property must precede any rule calls in the chain"); }

        this.internalRuleset.addRule(this.currentProperty, this.currentRule=new RuleLink(rule, ruleOptions));
        return this;
    }

    public withMessage = (messageOverride: ((value: any, ruleOptions?: any) => string) | string): RulesetBuilder =>
    {
        if(!this.currentRule)
        { throw new Error("A message override must precede an addRule call in the chain"); }

        this.currentRule.messageOverride = messageOverride;
        return this;
    }

    public appliesIf = (appliesFunction: ((model: any, value: any, ruleOptions?: any) => boolean) | boolean): RulesetBuilder =>
    {
        if(!this.currentRule)
        { throw new Error("An appliesIf function must precede an addRule call in the chain"); }
        this.currentRule.appliesIf = appliesFunction;
        return this;
    }

    public addRuleForEach = (rule: string, ruleOptions?: any): RulesetBuilder =>
    {
        if(rule == null || typeof(rule) == "undefined" || rule.length == 0)
        { throw new Error("A rule name is required"); }

        if(this.ruleRegistry && !this.ruleRegistry.hasRuleNamed(rule))
        { throw new Error(`The rule [${rule}] has not been registered`); }

        if(!this.currentProperty)
        { throw new Error("A property must precede any rule calls in the chain"); }

        var ruleLink = new RuleLink(rule, ruleOptions);
        this.currentRule = ruleLink;
        this.internalRuleset.addRule(this.currentProperty, new ForEachRule<RuleLink>(ruleLink));

        return this;
    }

    public addRuleset = (ruleset: Ruleset): RulesetBuilder =>
    {
        if(!this.currentProperty)
        { throw new Error("A property must precede any rule calls in the chain"); }

        this.internalRuleset.addRuleset(this.currentProperty, ruleset);
        return this;
    }

    public addRulesetForEach = (ruleset: Ruleset): RulesetBuilder =>
    {
        if(!this.currentProperty)
        { throw new Error("A property must precede any rule calls in the chain"); }

        this.internalRuleset.addRuleset(this.currentProperty, new ForEachRule<Ruleset>(ruleset));
        return this;
    }

    public build = (): Ruleset =>
    {
        return this.internalRuleset;
    }
}