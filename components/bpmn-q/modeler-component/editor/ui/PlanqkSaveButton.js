import React from "react";
import {
  dispatchWorkflowChangedEvent,
} from "../util/IoUtilities";

/**
 * React button which starts sending a changed workflow via event to the planqk platform
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function PlanqkSaveButton(props) {
  const { modeler } = props;

  return (
    <div>
      <button className="qwm-toolbar-btn" title="Save workflow">
        <div style={{display: "flex"}}>
          <div style={{display: "flex"}}>
            <span
              className={"qwm-icon-saving"}
              onClick={() => {
                dispatchWorkflowChangedEvent(modeler);
              }}
            >
              <span className="qwm-indent">Save</span>
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
