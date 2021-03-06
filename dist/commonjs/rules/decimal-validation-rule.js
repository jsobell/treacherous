"use strict";
;
var DecimalValidationRule = (function () {
    function DecimalValidationRule() {
        this.ruleName = "decimal";
        this.decimalRegex = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
    }
    DecimalValidationRule.prototype.validate = function (modelHelper, propertyName) {
        var value = modelHelper.resolve(propertyName);
        if (value === undefined || value === null) {
            return Promise.resolve(true);
        }
        var matchesRegex = this.decimalRegex.test(value);
        return Promise.resolve(matchesRegex);
    };
    DecimalValidationRule.prototype.getMessage = function (modelHelper, propertyName) {
        var value = modelHelper.resolve(propertyName);
        return "This field contains " + value + " which is not a decimal value";
    };
    return DecimalValidationRule;
}());
exports.DecimalValidationRule = DecimalValidationRule;
