import {expect} from "chai";
import {RulesetBuilder} from "../../src/rulesets/ruleset-builder";
import {RuleResolver} from "../../src/rulesets/rule-resolver";
import {PropertyResolver} from "property-resolver";

describe('Rule resolver', function () {

    var propertyResolver = new PropertyResolver();

    it('should correctly resolve a property name to a rule', function () {
        var rulesetBuilder = new RulesetBuilder();

        var ruleset = rulesetBuilder.create()
            .forProperty("foo")
            .addRule("required", true)
            .build();

        var propertyRoute = "foo";

        var ruleResolver = new RuleResolver();
        var locatedRules = ruleResolver.resolvePropertyRules(propertyResolver.decomposePropertyRoute(propertyRoute), ruleset);

        expect(locatedRules).not.to.be.null;
        expect(locatedRules.length).to.equal(1);
        expect(locatedRules[0].ruleName).to.equal("required");
        expect(locatedRules[0].ruleOptions).to.be.true;
    });

    it('should correctly resolve a property route to a rule', function () {
        var rulesetBuilder = new RulesetBuilder();

        var nestedRuleset = rulesetBuilder.create()
            .forProperty("bar")
            .addRule("required", true)
            .addRule("maxLength", 10)
            .build();

        var ruleset = rulesetBuilder.create()
            .forProperty("foo")
            .addRuleset(nestedRuleset)
            .build();

        var propertyRoute = "foo.bar";

        var ruleResolver = new RuleResolver();
        var locatedRules = ruleResolver.resolvePropertyRules(propertyResolver.decomposePropertyRoute(propertyRoute), ruleset);

        expect(locatedRules).not.to.be.null;
        expect(locatedRules.length).to.equal(2);
        expect(locatedRules[0].ruleName).to.equal("required");
        expect(locatedRules[0].ruleOptions).to.be.true;
        expect(locatedRules[1].ruleName).to.equal("maxLength");
        expect(locatedRules[1].ruleOptions).to.equal(10);
    });

    it('should correctly resolve a property route ending in an array to a rule', function () {
        var rulesetBuilder = new RulesetBuilder();

        var nestedRuleset = rulesetBuilder.create()
            .forProperty("bar")
            .addRuleForEach("maxLength", 10)
            .build();

        var ruleset = rulesetBuilder.create()
            .forProperty("foo")
            .addRuleset(nestedRuleset)
            .build();

        var propertyRoute = "foo.bar[0]";

        var ruleResolver = new RuleResolver();
        var locatedRules = ruleResolver.resolvePropertyRules(propertyResolver.decomposePropertyRoute(propertyRoute), ruleset);

        expect(locatedRules).not.to.be.null;
        expect(locatedRules.length).to.equal(1);
        expect(locatedRules[0].ruleName).to.equal("maxLength");
        expect(locatedRules[0].ruleOptions).to.equal(10);
    });

    it('should only resolve array child property rules and not array container rules', function () {
        var rulesetBuilder = new RulesetBuilder();

        var ruleset = rulesetBuilder.create()
            .forProperty("foo")
            .addRule("maxLength", 2)
            .addRuleForEach("maxValue", 10)
            .build();

        var propertyRoute = "foo[0]";

        var ruleResolver = new RuleResolver();
        var locatedRules = ruleResolver.resolvePropertyRules(propertyResolver.decomposePropertyRoute(propertyRoute), ruleset);

        expect(locatedRules).not.to.be.null;
        expect(locatedRules.length).to.equal(1);
        expect(locatedRules[0].ruleName).to.equal("maxValue");
        expect(locatedRules[0].ruleOptions).to.equal(10);
    });

    it('should correctly resolve a property route with foreach ruleset', function () {
        var rulesetBuilder = new RulesetBuilder();
        var elementRuleset = rulesetBuilder.create()
            .forProperty("bar")
            .addRule("required")
            .addRule("maxLength", 5)
            .build();

        var ruleset = rulesetBuilder.create()
            .forProperty("foo")
            .addRulesetForEach(elementRuleset)
            .build();

        var propertyRoute = "foo[1].bar";

        var ruleResolver = new RuleResolver();
        var locatedRules = ruleResolver.resolvePropertyRules(propertyResolver.decomposePropertyRoute(propertyRoute), ruleset);

        expect(locatedRules).not.to.be.null;
        expect(locatedRules.length).to.equal(2);
        expect(locatedRules[0].ruleName).to.equal("required");
        expect(locatedRules[1].ruleName).to.equal("maxLength");
        expect(locatedRules[1].ruleOptions).to.equal(5);
    });

    it('should correctly resolve a property route with a foreach to a rule', function () {
        var rulesetBuilder = new RulesetBuilder();

        var nestedRuleset = rulesetBuilder.create()
            .forProperty("woo")
            .addRule("required", true)
            .addRule("maxLength", 10)
            .build();

        var forEachRuleset = rulesetBuilder.create()
            .forProperty("bar")
            .addRulesetForEach(nestedRuleset)
            .build();

        var ruleset = rulesetBuilder.create()
            .forProperty("foo")
            .addRuleset(forEachRuleset)
            .build();

        var propertyRoute = "foo.bar[2].woo";

        var ruleResolver = new RuleResolver();
        var locatedRules = ruleResolver.resolvePropertyRules(propertyResolver.decomposePropertyRoute(propertyRoute), ruleset);

        expect(locatedRules).not.to.be.null;
        expect(locatedRules.length).to.equal(2);
        expect(locatedRules[0].ruleName).to.equal("required");
        expect(locatedRules[0].ruleOptions).to.be.true;
        expect(locatedRules[1].ruleName).to.equal("maxLength");
        expect(locatedRules[1].ruleOptions).to.equal(10);
    });

});