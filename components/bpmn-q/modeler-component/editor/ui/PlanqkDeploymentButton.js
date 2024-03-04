import React from "react";
import NotificationHandler from "./notifications/NotificationHandler";
import {dispatchWorkflowTransformedEvent} from "../util/IoUtilities";
import { startPlanqkReplacementProcess } from "../../extensions/planqk/exec-completion/PlanQKServiceTaskCompletion";
import { startDataFlowReplacementProcess } from "../../extensions/data-extension/transformation/TransformationManager";

/**
 * React button for starting the deployment of the workflow.
 * The workflow modeler will not deploy directly, it will transform the workflow into a camunda-compatible workflow and
 * inform the planqk platform about the transformed workflow.
 *
 * @param props
 * @returns {JSX.Element} The React button
 * @constructor
 */
export default function PlanqkDeploymentButton(props) {
  const { modeler } = props;

  async function transformToCamundaBPMN(xml) {
    console.log("PlanQK BPMN workflow to be transformed:", xml);

    console.log("Transforming data flow extension to BPMN");

    const replaceDataFlowResult = await startDataFlowReplacementProcess(xml);
    if (replaceDataFlowResult.status === "failed") {
      NotificationHandler.getInstance().displayNotification({
        type: "error",
        title: "Data Flow Transformation Failure",
        content:
          "Could not transform data flow: " + replaceDataFlowResult.cause,
        duration: 20000,
      });
      return;
    }

    console.log("Transforming workflow to Camunda BPMN");
    const replaceResult = await startPlanqkReplacementProcess(
      replaceDataFlowResult.xml
    );
    if (replaceResult.status === "failed") {
      NotificationHandler.getInstance().displayNotification({
        type: "error",
        title: "PlanQK Workflow Transformation Failure",
        content:
          "Could not transform PlanQK workflow to Camunda BPMN: " +
          replaceResult.cause,
        duration: 20000,
      });
      return;
    }
    console.log("Camunda BPMN resulting from transformation:", replaceResult.xml);

    NotificationHandler.getInstance().displayNotification({
      title: "Deployment to Camunda engine started",
      content: "You can now publish your service and use it within an application.",
    });

    // Inform PlanQK that a new service must be created
    await  dispatchWorkflowTransformedEvent(replaceResult.xml);
  }

  async function onClick() {
    await transformToCamundaBPMN((await modeler.saveXML({ format: true })).xml);
  }

  return (
    <div>
      <button
        type="button"
        className="qwm-toolbar-btn"
        title="Deploy the current workflow to a workflow engine"
        onClick={() => onClick()}
      >
        <span className="qwm-workflow-deployment-btn">
          <span className="qwm-indent">Deploy Workflow</span>
        </span>
      </button>
    </div>
  );
}
