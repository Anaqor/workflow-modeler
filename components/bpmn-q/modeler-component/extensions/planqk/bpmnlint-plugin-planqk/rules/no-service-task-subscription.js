const {
  is
} = require('bpmnlint-utils');
const { PLANQK_SERVICE_TASK } = require("../../utilities/Constants");


/**
 * Rule that checks if a PlanQK ServiceTask has a subscription assigned
 */
module.exports = function() {

  function check(node, reporter) {
    if (is(node, PLANQK_SERVICE_TASK) && !node.subscriptionId) {
      reporter.report(node.id, 'PlanQK service task has no subscription assigned.');
    }
  }

  return {
    check: check
  };
};
