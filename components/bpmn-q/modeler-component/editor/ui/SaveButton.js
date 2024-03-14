import React from "react";
import { saveModelerAsLocalFile } from "../util/IoUtilities";

const editorConfig = require("../config/EditorConfigManager");

/**
 * React button which saves the current workflow to the users local file system when clicked
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function SaveButton(props) {
  const { modeler, planqkIntegration } = props;

  return (
    <div>
      <button className="qwm-toolbar-btn" title={planqkIntegration ? "Export workflow to file" : "Save workflow"}>
        <div style={{display: "flex"}}>
          <div style={{display: "flex"}}>
            <span
                className={"qwm-icon-saving"}
                onClick={() => {
                  saveModelerAsLocalFile(modeler,editorConfig.getFileName(),editorConfig.getFileFormat(),false);
                }}
            >
              <span className="qwm-indent">{planqkIntegration ? "Export" : "Save"}</span>
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
