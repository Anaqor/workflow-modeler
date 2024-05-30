import planqkServiceProps from "./SubscriptionProperties";
import inputOutputProps from "./InputOutputProperties";
import {useLayoutState, useShowEntryEvent} from "@bpmn-io/properties-panel";
import {useLayoutEffect} from "@bpmn-io/properties-panel/preact/hooks";
import {jsx, jsxs} from "@bpmn-io/properties-panel/preact/jsx-runtime";
import classnames from "classnames";

import { is } from "bpmn-js/lib/util/ModelUtil";

const LOW_PRIORITY = 500;

let ArrowIcon = function ArrowIcon(props) {
  return jsx("svg", {
    ...props,
    children: jsx("path", {
      fillRule: "evenodd",
      d: "m11.657 8-4.95 4.95a1 1 0 0 1-1.414-1.414L8.828 8 5.293 4.464A1 1 0 1 1 6.707 3.05L11.657 8Z"
    })
  });
};
ArrowIcon.defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16"
};


/**
 * A provider of the properties panel of the bpmn-js modeler. Provides custom groups for PlanQK service tasks.
 *
 * @param propertiesPanel The properties panel this provider is registered at.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 * @param activeSubscriptions An array of all subscriptions the user currently has subscribed to.
 * @param openApiMap A map which holds the openApi description for each active subscription.
 */
export default function ServiceTaskPropertiesProvider(
  propertiesPanel,
  translate,
  activeSubscriptions,
  openApiMap,
) {
  this.activeSubscriptions = activeSubscriptions;
  this.openApiMap = openApiMap;

  /**
   * Return the groups provided for the given element.
   *
   * @param element The element the groups are requested for.
   *
   * @return groups middleware
   */
  this.getGroups = function (element) {
    const activeSubs = this.activeSubscriptions;
    const openApiMap = this.openApiMap;

    /**
     * Add custom properties group for PlanQK service task
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {
      if (is(element, "planqk:ServiceTask")) {
        const removeLabels = ["Asynchronous continuations","Execution listeners","Extension properties"];
        const modifiedGroups = groups.filter(function(item) {
          return removeLabels.indexOf(item.label) === -1;
        });
        modifiedGroups.unshift(createInputOutputGroup(element, translate));
        modifiedGroups.unshift(createSubscriptionGroup(element, translate));
        modifiedGroups.push(createServiceTaskGroupForSchemaExample(element, translate, activeSubs, openApiMap));
        return modifiedGroups;
      }
      if (is(element, "bpmn:Process")) {
        const removeLabels = ["History cleanup","Tasklist","Candidate starter","External task","Job execution","Execution listeners","Extension properties"];
        const modifiedGroups = groups.filter(function(item) {
          return removeLabels.indexOf(item.label) === -1;
        });
        return modifiedGroups;
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

ServiceTaskPropertiesProvider.$inject = [
  "propertiesPanel",
  "translate",
  "activeSubscriptions",
  "openApiMap"
];

/**
 * Creates a group to display subscription details of the given PlanQK service task
 *
 * @param element The given PlanQK service task.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element}]|*), id: string, label}}
 */
function createSubscriptionGroup(element, translate) {
  return {
    id: "subscriptionProperties",
    label: translate("Subscription"),
    entries: planqkServiceProps(element),
  };
}

/**
 * Creates a group to display input output details of the given PlanQK service task
 *
 * @param element The given PlanQK service task.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element}]|*), id: string, label}}
 */
function createInputOutputGroup(element, translate) {
  return {
    id: "inputOutputProperties",
    label: translate("Input / Output"),
    entries: inputOutputProps(element),
  };
}

function createServiceTaskGroupForSchemaExample(element, translate, activeSubscriptions, openApiMap) {
  let xxx = {
    // return {
    id: "dataMapObjectPropertiesForSchemaExample",
    label: translate("Schema Example"),
    labelData: translate("Schema Example for data"),
    labelParams: translate("Schema Example for params"),
    valueData: getValueForSchema(element,activeSubscriptions,openApiMap,"data"),
    valueParams: getValueForSchema(element,activeSubscriptions,openApiMap,"params"),
    component: PlanqkTextArea,
  };
  console.log(xxx);
  return xxx;
}


function getValueForSchema(element, activeSubscriptions, openApiMap, section) {
  if(element.businessObject.subscriptionId) {
    const openApiString = getOpenApiFromMapBySubscriptionId(openApiMap,element.businessObject.subscriptionId, section);
    console.log(openApiString);
    return openApiString;
  } else {
    return "no subscription assigned"
  }
}

function getOpenApiFromMapBySubscriptionId(openApiMap, subscriptionId, section) {
  for( let subIndex = 0; subIndex < openApiMap.length; subIndex++) {
    if(openApiMap[subIndex].subscription === subscriptionId) {
      let exampleStructure = {};
      const sectionProperties = openApiMap[subIndex].openApi?.paths?.["/"]?.post?.requestBody?.content?.["application/json"]?.schema?.properties?.[section]?.properties;
      if(sectionProperties) {
        for(const dataProperty in sectionProperties) {
          exampleStructure[dataProperty] = sectionProperties[dataProperty].example ? sectionProperties[dataProperty].example : {type: sectionProperties[dataProperty].type};
        }
      } else {
        exampleStructure["sorry"] = "no schema example available for " + section;
      }
      return JSON.stringify(exampleStructure,undefined,2);
    }
  }
  return "OpenApi for " + subscriptionId + " not found"
}

function resizeToContents(element) {
  element.style.height = 'auto';

  // a 2px pixel offset is required to prevent scrollbar from
  // appearing on OS with a full length scroll bar (Windows/Linux)
  element.style.height = `${element.scrollHeight + 2}px`;
}
function PlanqkTextArea(props) {
  const {
    id,
    label,
    labelData,
    labelParams,
    valueData = '',
    valueParams = '',
    monospace,
    bigSpace,
    autoResize,
    rows = autoResize ? 1 : 2
  } = props;
  const [open, setOpen] = useLayoutState(['groups', id, 'open'], false);
  const toggleOpen = () => {
    console.log("toggle open -> ");
    setOpen(!open);
    console.log(open);
  };
  const ref = useShowEntryEvent(id);
  useLayoutEffect(() => {
    autoResize && resizeToContents(ref.current);
  }, []);

  return jsxs("div", {
    class: "bio-properties-panel-group",
    "data-group-id": 'group-' + id,
    children: [
      jsxs(
          "div", {
            class: classnames('bio-properties-panel-group-header', open ? 'open' : ''),
            onClick: toggleOpen,
            children: [
              jsx(
                  "div", {
                    class: "bio-properties-panel-group-header-title",
                    title: label,
                    children: label
                  }
              ),
              jsx(
                  "div", {
                    class: "bio-properties-panel-group-header-buttons",
                    children: [
                      jsx(
                          "div", {
                            class: "bio-properties-panel-dot",
                            title: "Section contains data",
                          }
                      ),
                      jsx(
                          "button", {
                            class: "bio-properties-panel-group-header-button bio-properties-panel-arrow",
                            title: "Toggle section",
                            children: [
                              jsx(
                                  ArrowIcon, {
                                    class: open ? 'bio-properties-panel-arrow-down' : 'bio-properties-panel-arrow-right'
                                  }
                              )
                            ]
                          }
                      )
                    ]
                  }
              )
            ]
          }
      ),
      jsx(
          "div", {
            class: classnames('bio-properties-panel-group-entries', open ? 'open' : ''),
            children: [
              jsx(
                  "div", {
                    class: "bio-properties-panel-entry",
                    "data-entry-id":"documentation",
                    children: [
                      jsx(
                          "div", {
                            class: "bio-properties-panel-textarea",
                            children: [
                              jsx(
                                  "label", {
                                    for: `planqk-properties-panel-data-schema-` + id,
                                    class: "bio-properties-panel-label",
                                    children: labelData
                                  }
                              ),
                              jsx(
                                  "textarea", {
                                    ref: ref,
                                    id: `planqk-properties-panel-data-schema-` + id,
                                    name: id,
                                    spellCheck: "false",
                                    class: classnames('bio-properties-panel-input',
                                        monospace ? 'bio-properties-panel-input-monospace' : '',
                                        autoResize ? 'auto-resize' : '',
                                        bigSpace? 'planqk-text-area-big-space' : 'planqk-text-area-big-space'),
                                    rows: rows,
                                    value: valueData,
                                    disabled: true,
                                    "data-gramm": "false"
                                  }
                              ),
                              jsx(
                                  "label", {
                                    for: `planqk-properties-panel-params-schema-` + id,
                                    class: "bio-properties-panel-label",
                                    children: labelParams
                                  }
                              ),
                              jsx(
                                  "textarea", {
                                    ref: ref,
                                    id: `planqk-properties-panel-params-schema-` + id,
                                    name: id,
                                    spellCheck: "false",
                                    class: classnames('bio-properties-panel-input',
                                        monospace ? 'bio-properties-panel-input-monospace' : '',
                                        autoResize ? 'auto-resize' : '',
                                        bigSpace? 'planqk-text-area-big-space' : 'planqk-text-area-big-space'),
                                    rows: rows,
                                    value: valueParams,
                                    disabled: true,
                                    "data-gramm": "false"
                                  }
                              ),
                            ]
                          }
                      )
                    ]
                  }
              )
            ]
          }
      )
    ]
  });
}


