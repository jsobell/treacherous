"use strict";
var ruleset_1 = require("./ruleset");
var rule_link_1 = require("./rule-link");
var for_each_rule_1 = require("./for-each-rule");
var RulesetBuilder = (function () {
    function RulesetBuilder(ruleRegistry) {
        var _this = this;
        this.ruleRegistry = ruleRegistry;
        this.create = function () {
            _this.internalRuleset = new ruleset_1.Ruleset();
            _this.currentProperty = null;
            return _this;
        };
        this.forProperty = function (propertyName) {
            _this.currentProperty = propertyName;
            _this.currentRule = null;
            return _this;
        };
        this.addRule = function (rule, ruleOptions) {
            if (rule == null || typeof (rule) == "undefined" || rule.length == 0) {
                throw new Error("A rule name is required");
            }
            if (_this.ruleRegistry && !_this.ruleRegistry.hasRuleNamed(rule)) {
                throw new Error("The rule [" + rule + "] has not been registered");
            }
            if (!_this.currentProperty) {
                throw new Error("A property must precede any rule calls in the chain");
            }
            _this.internalRuleset.addRule(_this.currentProperty, _this.currentRule = new rule_link_1.RuleLink(rule, ruleOptions));
            return _this;
        };
        this.withMessage = function (messageOverride) {
            if (!_this.currentRule) {
                throw new Error("A message override must precede an addRule call in the chain");
            }
            _this.currentRule.messageOverride = messageOverride;
            return _this;
        };
        this.appliesIf = function (appliesFunction) {
            if (!_this.currentRule) {
                throw new Error("An appliesIf function must precede an addRule call in the chain");
            }
            _this.currentRule.appliesIf = appliesFunction;
            return _this;
        };
        this.addRuleForEach = function (rule, ruleOptions) {
            if (rule == null || typeof (rule) == "undefined" || rule.length == 0) {
                throw new Error("A rule name is required");
            }
            if (_this.ruleRegistry && !_this.ruleRegistry.hasRuleNamed(rule)) {
                throw new Error("The rule [" + rule + "] has not been registered");
            }
            if (!_this.currentProperty) {
                throw new Error("A property must precede any rule calls in the chain");
            }
            var ruleLink = new rule_link_1.RuleLink(rule, ruleOptions);
            _this.currentRule = ruleLink;
            _this.internalRuleset.addRule(_this.currentProperty, new for_each_rule_1.ForEachRule(ruleLink));
            return _this;
        };
        this.addRuleset = function (ruleset) {
            if (!_this.currentProperty) {
                throw new Error("A property must precede any rule calls in the chain");
            }
            _this.internalRuleset.addRuleset(_this.currentProperty, ruleset);
            return _this;
        };
        this.addRulesetForEach = function (ruleset) {
            if (!_this.currentProperty) {
                throw new Error("A property must precede any rule calls in the chain");
            }
            _this.internalRuleset.addRuleset(_this.currentProperty, new for_each_rule_1.ForEachRule(ruleset));
            return _this;
        };
        this.build = function () {
            return _this.internalRuleset;
        };
    }
    return RulesetBuilder;
}());
exports.RulesetBuilder = RulesetBuilder;
