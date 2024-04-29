import React from "react";
import planqkIcons from "./resources/css/planqk-icons.css";
import planqkStyles from "./resources/css/planqk-styles.css";
import PlanQKExtensionModule from "./";
import { startPlanqkReplacementProcess } from "./exec-completion/PlanQKServiceTaskCompletion";
import TransformationButton from "../../editor/ui/TransformationButton";

let planqkModdleDescriptor = require("./resources/planqk-service-task-ext.json");

/**
 * Plugin Object of the PlanQK extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  name: "planqk",
  extensionModule: PlanQKExtensionModule,
  moddleDescription: planqkModdleDescriptor,
  styling: [planqkStyles, planqkIcons],
  transformExtensionButton: (
    <TransformationButton
      name="PlanQK Transformation"
      transformWorkflow={async (xml) => {
        return await startPlanqkReplacementProcess(xml);
      }}
    />
  ),
};
