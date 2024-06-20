const {
  is,
  isAny
} = require('bpmnlint-utils');


/**
 * A rule that checks for the presence of a start event per scope.
 */
module.exports = function() {

  function hasProcessOutputDataObject(node) {
    const flowElements = node.flowElements || [];

    return (
      flowElements.some(node => is(node, 'planqk:ProcessOutputDataMapObject'))
    );
  }

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Process'
    ])) {
      return;
    }

    if (!hasProcessOutputDataObject(node)) {
      reporter.report(node.id, 'No process output data object specified, the process will not return any results.');
    }
  }

  return { check };
};
