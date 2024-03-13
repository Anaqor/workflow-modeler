import React from "react";
import {
  dispatchWorkflowChangedEvent,
} from "../util/IoUtilities";
import NotificationHandler from "./notifications/NotificationHandler";

/**
 * React button which starts sending a changed workflow via event to the planqk platform
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function PlanqkSaveButton(props) {
  const { modeler } = props;

  async function saveToPlanQK() {
    await dispatchWorkflowChangedEvent(modeler);

    NotificationHandler.getInstance().displayNotification({
      title: "Workflow saved",
      content: "You can now safely leave the editor and continue working on the workflow later again." +
          " ________________________________________________________________________ " +
          "Note: to execute the changed workflow you have to also deploy it.",
      duration: 6000,
    });
  }

  return (
    <div>
      <button className="qwm-toolbar-btn" title="Save workflow">
        <div style={{display: "flex"}}>
          <div style={{display: "flex"}}>
            <span
              className={"qwm-icon-saving"}
              onClick={() => saveToPlanQK() }
            >
              <span className="qwm-indent">Save</span>
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
