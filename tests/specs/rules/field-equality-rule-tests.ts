import {expect} from "chai";
import {PropertyResolver} from "property-resolver";
import {ModelHelper} from "../../../src/model-helper";
import {FieldEqualityValidationRule} from "../../../src/rules/field-equality-validation-rule";

describe("Validation Rules", function(){
    describe('Field Equality Rule', function () {

        var modelHelper = new ModelHelper(new PropertyResolver(), { a:123, b:123, c:345,  d1:new Date(1995, 11, 17), d2:new Date(1995, 11, 17), d3:new Date(1994, 11, 18) });

        it('should be valid when numbers equal', function (done) {
            var rule = new FieldEqualityValidationRule();
            rule.validate(modelHelper,'a', 'b').then(function(isValid){
                expect(isValid).to.be.true;
                done();
            }).catch(done);
        });

        it('should be invalid when fields are not equal', function (done) {
            var rule = new FieldEqualityValidationRule();
            rule.validate(modelHelper,'a', 'c').then(function(isValid){
                expect(isValid).to.be.false;
                done();
            }).catch(done);
        });

        it('should be valid when date fields are equal', function (done) {
            var rule = new FieldEqualityValidationRule();
            rule.validate(modelHelper,'d1', 'd2').then(function(isValid){
                expect(isValid).to.be.true;
                done();
            }).catch(done);
        });

        it('should be invalid when date fields are not equal', function (done) {
            var rule = new FieldEqualityValidationRule();
            rule.validate(modelHelper,'d1', 'd3').then(function(isValid){
                expect(isValid).to.be.false;
                expect(rule.getMessage(modelHelper,'d1','d3')).to.contain('Field d1 should be equal to d3')
                done();
            }).catch(done);
        });
    });
});