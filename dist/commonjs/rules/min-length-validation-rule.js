var MinLengthValidationRule = (function () {
    function MinLengthValidationRule() {
        this.ruleName = "minLength";
    }
    MinLengthValidationRule.prototype.validate = function (value, minLength) {
        if (value === undefined || value === null || value.length == 0) {
            return Promise.resolve(true);
        }
        if (value.length >= minLength) {
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    };
    MinLengthValidationRule.prototype.getMessage = function (value, minLength) {
        return "This field has a length of " + value.length + " but should more than " + minLength;
    };
    return MinLengthValidationRule;
})();
exports.MinLengthValidationRule = MinLengthValidationRule;