const {
  is
} = require('bpmnlint-utils');
const { PLANQK_SERVICE_TASK } = require("../../utilities/Constants");
const { getPluginConfig } = require("../../../../editor/plugin/PluginConfigHandler");
const { pluginNames } = require("../../../../editor/EditorConstants");


/**
 * Rule that checks if a PlanQK ServiceTask has a subscription assigned and that the subscription exists and is valid
 */
module.exports = function() {

  function check(node, reporter) {
    const config = getPluginConfig(pluginNames.PLANQK);

    if (!is(node, PLANQK_SERVICE_TASK)) {
      return;
    }

    const taskName = node.name ?? '';
    if (!node.subscriptionId) {
      reporter.report(node.id, `PlanQK service task ${taskName} has no subscription assigned.`);
      return;
    }

    const subscription = config.subscriptions.find(obj => obj.id === node.subscriptionId);
    if (!subscription) {
      reporter.report(node.id, `Subscription ${node.subscriptionId} of PlanQK service task ${taskName} could not be found.`);
      return;
    }

    if (subscription.api.gatewayEndpoint !== node.serviceEndpoint) {
      reporter.report(node.id, `Subscription ${node.subscriptionId} of PlanQK service task ${taskName} does not refer to a valid service endpoint.`);
    }
  }

  return {
    check: check
  };
};
