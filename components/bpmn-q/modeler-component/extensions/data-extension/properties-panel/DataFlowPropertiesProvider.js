import keyValueMap from "./KeyValueMap";
import { is } from "bpmn-js/lib/util/ModelUtil";
import {ListGroup, TextAreaEntry, useLayoutState, useShowEntryEvent} from "@bpmn-io/properties-panel";
import * as consts from "../Constants";
import * as configConsts from "../../../editor/configurations/Constants";
import ConfigurationsProperties from "../../../editor/configurations/ConfigurationsProperties";
import { getTransformationTaskConfiguration } from "../transf-task-configs/TransformationTaskConfigurations";
import {jsx, jsxs} from "@bpmn-io/properties-panel/preact/jsx-runtime";
import classnames from "classnames";
import {debounce} from 'min-dash';
import {useService} from "bpmn-js-properties-panel";
import planqkDataMapProps from "./DataFlowProperties";

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
 * A properties provider for the properties panel of the bpmn-js modeler which displays the custom properties of the
 * DataFlow elements.
 *
 * @param propertiesPanel The properties panel of the bpmn-js modeler this provider is registered at.
 * @param {Function} translate The translate function of the bpmn-js modeler
 * @param injector Injector module of the bpmn-js modeler used to load the required dependencies.
 */
export default function DataFlowPropertiesProvider(
    propertiesPanel,
    translate,
    injector
) {
  /**
   * Return the property groups provided for the given element.
   *
   * @param element The given element
   *
   * @return groups middleware
   */
  this.getGroups = function (element) {
    /**
     * Return a middleware that adds groups for the properties of the DataFlow elements
     *
     * @param {Object[]} groups The default groups for the element
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {
      let modifiedGroups = groups;

      if (is(element, consts.PROCESS_INPUT_DATA_MAP_OBJECT)) {
        // remove unwanted groups
        const removeLabels = ["General", "Extension properties", "Documentation"];
        modifiedGroups = modifiedGroups.filter(function(item) {
          return removeLabels.indexOf(item.label) === -1;
        });

        // add group for displaying the content attribute of a DataMapObject as a key value map
        modifiedGroups.push(createDataMapObjectGroupForContent(element, injector, translate));

        // add further groups for Input-DataMap
        modifiedGroups.push(createDataMapObjectGroupForSchemaExample(element, injector, translate));
        modifiedGroups.push(createDataMapObjectGroupForPrivatePublicChoice(element, injector, translate));
        if( !element.businessObject.visibility ) {
          //set default for visibility to "public"
          Object.defineProperty(element.businessObject, "visibility", {value: "public", writable: true});
        }
        modifiedGroups.push(createDataMapObjectGroupForDataParamChoice(element, injector, translate));
        if( !element.businessObject.inputFor ) {
          //set default for inputFor to "data"
          Object.defineProperty(element.businessObject, "inputFor", {value: "data", writable: true});
        }

        // add group for the automatic naming of the node
        // this only works for input/output nodes
        modifiedGroups.push(createObjectGroupForNodeNaming(element));
      }

      if (is(element, consts.PROCESS_OUTPUT_DATA_MAP_OBJECT)) {
        // remove unwanted groups
        const removeLabels = ["General", "Extension properties", "Documentation"];
        modifiedGroups = modifiedGroups.filter(function(item) {
          return removeLabels.indexOf(item.label) === -1;
        });

        // add further groups for Output-DataMap
        modifiedGroups.push(createDataMapObjectGroupForSchemaExample(element, injector, translate));
        modifiedGroups.push(createDataMapObjectGroupForPrivatePublicChoice(element, injector, translate));
        if( !element.businessObject.visibility ) {
          //set default for visibility to "public"
          Object.defineProperty(element.businessObject, "visibility", {value: "public", writable: true});
        }

        // add group for the automatic naming of the node
        // this only works for input/output nodes
        modifiedGroups.push(createObjectGroupForNodeNaming(element));
      }

      if (is(element, consts.DATA_MAP_OBJECT) && !is(element, consts.PROCESS_INPUT_DATA_MAP_OBJECT) && !is(element, consts.PROCESS_OUTPUT_DATA_MAP_OBJECT)) {
        // remove unwanted groups
        const removeLabels = ["Extension properties", "Documentation"];
        modifiedGroups = modifiedGroups.filter(function(item) {
          return removeLabels.indexOf(item.label) === -1;
        });

        // add group for displaying the content attribute of a DataMapObject as a key value map
        modifiedGroups.push(createDataMapObjectGroupForContent(element, injector, translate));

        // add further groups for Intermediate-DataMap
        modifiedGroups.push(createDataMapObjectGroupForSchemaExample(element, injector, translate));
        modifiedGroups.push(createDataMapObjectGroupForPrivatePublicChoice(element, injector, translate));
        if( !element.businessObject.visibility ) {
          //set default for visibility to "public"
          Object.defineProperty(element.businessObject, "visibility", {value: "public", writable: true});
        }
      }

      // add group for displaying the details attribute of a DataStoreMap as a key value map
      if (is(element, consts.DATA_STORE_MAP)) {
        modifiedGroups.push(createDataStoreMapGroup(element, injector, translate));
      }

      // add group for displaying the properties of transformation task and its configurations
      if (is(element, consts.TRANSFORMATION_TASK)) {
        // load applied configuration
        const selectedConfiguration = getTransformationTaskConfiguration(
          element.businessObject.get(configConsts.SELECT_CONFIGURATIONS_ID)
        );
        if (selectedConfiguration) {
          // add properties group for properties defined by the configuration
          modifiedGroups.splice(
            1,
            0,
            createTransformationTaskConfigurationsGroup(
              element,
              injector,
              translate,
              selectedConfiguration
            )
          );
        }

        // add entries for the parameters attribute of a transformation task
        modifiedGroups.push(
          createTransformationTaskGroup(element, injector, translate)
        );
      }

      // add group for displaying the expressions attribute fo the transformation association
      if (is(element, consts.TRANSFORMATION_ASSOCIATION)) {
        modifiedGroups.push(
          createTransformationAssociationGroup(element, injector, translate)
        );
      }

      return modifiedGroups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

DataFlowPropertiesProvider.$inject = [
  "propertiesPanel",
  "translate",
  "injector",
];

/**
 * Creates a (properties)group to display the attributes defined in the properties section of data-flow-extension.json, i.e. schemaExample, inputFor, visibility
 *
 * @param element The given PlanQK data map object.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element}]|*), id: string, label}}
 */
function createPropertiesGroupForDataMapObject(element, translate) {
    return {
        id: "dataMapProperties",
        label: translate("Data Map Properties"),
        entries: planqkDataMapProps(element),
    };
}

/**
 * Creates a properties group for displaying the custom properties of a DataFlow data map object. This group contains
 * a key value map for the content attribute of the data map object.
 *
 * @param element THe element the properties group is for
 * @param injector The injector module to load necessary dependencies
 * @param translate The translate function of the bpmn-js modeler
 * @returns {{add: function(*): void, component: ((function(import('../PropertiesPanel').ListGroupDefinition): preact.VNode<any>)|*), id: string, label, items: *}}
 */
function createDataMapObjectGroupForContent(element, injector, translate) {
  console.log("createDataMapObjectGroupForContent");
  const attributeName = consts.CONTENT;
  let xxx = {
    // return {
    id: "dataMapObjectProperties",
    label: translate("Content"),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName }),
  };
  console.log(xxx);
  return xxx;
}

function createDataMapObjectGroupForSchemaExample(element, injector, translate) {
  console.log("createDataMapObjectGroupForSchemaExample");
  let xxx = {
    // return {
    id: "dataMapObjectPropertiesForSchemaExample",
    label: translate("Schema Example"),
    component: PlanqkTextArea,
  };
  console.log(xxx);
  return xxx;
}

function createObjectGroupForNodeNaming(element) {
    console.log("createObjectGroupForNodeNaming");
    let xxx = {
        // return {
        id: "dataMapObjectNaming",
        element: element,
        component: PlanqkNodeNaming,
    };
    console.log(xxx);
    return xxx;
}

function createDataMapObjectGroupForPrivatePublicChoice(element, injector, translate) {
    console.log("createDataMapObjectGroupForPrivatePublicChoice");
    let xxx = {
        // return {
        id: "visibility",
        label: translate("Visibility"),
        title: translate("Visibility"),
        choices: ["private","public"],
        component: PlanqkRadioChoice,
    };
    console.log(xxx);
    return xxx;
}

function createDataMapObjectGroupForDataParamChoice(element, injector, translate) {
    console.log("createDataMapObjectGroupForDataParamChoice");
    let xxx = {
        // return {
        id: "inputFor",
        label: translate("Input For"),
        title: translate("Input For"),
        choices: ["data","param"],
        component: PlanqkRadioChoice,
    };
    console.log(xxx);
    return xxx;
}


/**
 * Creates a properties group for displaying the custom properties of a DataFlow data store map. This group contains
 * a key value map for the details attribute of the data store map.
 *
 * @param element
 * @param injector
 * @param translate
 * @returns {{add: function(*): void, component: ((function(import('../PropertiesPanel').ListGroupDefinition): preact.VNode<any>)|*), id: string, label, items: *}}
 */
function createDataStoreMapGroup(element, injector, translate) {
  const attributeName = consts.DETAILS;
  return {
    id: "dataStoreMapProperties",
    label: translate("Details"),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName }),
  };
}

/**
 * Creates a properties group for displaying the custom properties of a DataFlow transformation task. This group contains
 * a key value map for the parameters attribute of the transformation task.
 *
 * @param element THe element the properties group is for
 * @param injector The injector module to load necessary dependencies
 * @param translate The translate function of the bpmn-js modeler
 * @returns {{add: function(*): void, component: ((function(import('../PropertiesPanel').ListGroupDefinition): preact.VNode<any>)|*), id: string, label, items: *}}
 */
function createTransformationTaskGroup(element, injector, translate) {
  const attributeName = consts.PARAMETERS;
  return {
    id: "transformationTaskProperties",
    label: translate("Parameters"),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName }),
  };
}

/**
 * Creates a properties group for displaying the custom properties of a DataFlow transformation association. This group contains
 * a key value map for the expressions attribute of the transformation association.
 *
 * @param element THe element the properties group is for
 * @param injector The injector module to load necessary dependencies
 * @param translate The translate function of the bpmn-js modeler
 * @returns {{add: function(*): void, component: ((function(import('../PropertiesPanel').ListGroupDefinition): preact.VNode<any>)|*), id: string, label, items: *}}
 */
function createTransformationAssociationGroup(element, injector, translate) {
  const attributeName = consts.EXPRESSIONS;
  return {
    id: "transformationAssociationProperties",
    label: translate("Expressions"),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName }),
  };
}

/**
 * Creates a group defining entries for the properties defined in the given configuration for a transformation task.
 *
 * @param element THe element the properties group is for
 * @param injector The injector module to load necessary dependencies
 * @param translate The translate function of the bpmn-js modeler
 * @param configuration The given configuration applied to the element
 * @returns {{entries: (*), id: string, label}} The created properties group.
 */
function createTransformationTaskConfigurationsGroup(
  element,
  injector,
  translate,
  configuration
) {
  console.log("createTransformationTaskConfigurationsGroup");
  let xxx = {
    // return {
    id: "serviceTaskConfigurationsGroupProperties",
    label: translate(configuration.groupLabel || "Configurations Properties"),
    entries: ConfigurationsProperties(
      element,
      injector,
      translate,
      configuration
    ),
  };
  console.log(xxx);
  return xxx;
}


function PlanqkTextArea(props) {
    const {
        id,
        label,
        element,
    } = props;
    const [open, setOpen] = useLayoutState(['groups', id, 'open'], false);
    const toggleOpen = () => {
        setOpen(!open);
    };
    const modeling = useService("modeling");

    const getValue = () => {
        return element.businessObject.schemaExample || '';
    };
    const setValue = (value) => {
        modeling.updateProperties(element, {
            schemaExample: value,
        });
    };

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
                                    TextAreaEntry({
                                        element,
                                        id: "data_map_description",
                                        label: "Schema Example",
                                        description: "Provide an OpenAPI specification example of the schema.",
                                        getValue,
                                        setValue,
                                        debounce,
                                        rows: 3,
                                    })
                                ]
                            }
                        )
                    ]
                }
            )
        ]
    });
}

function PlanqkNodeNaming(props) {
    const {
        element,
    } = props;
    const modeling = useService("modeling");

    const computeNameOfNode = () => {
        let targetNodeNames = '';
        let connectors = is(element, consts.PROCESS_INPUT_DATA_MAP_OBJECT) ? element.outgoing : element.incoming;
        if(connectors.length > 0) {
            connectors.forEach( (connector) => {
                let associationLine = null;
                element.parent.children.forEach((child) => {
                    if (child.id === connector.id) {
                        associationLine = child;
                    }
                })
                if(associationLine != null) {
                    targetNodeNames += (associationLine.businessObject.$parent.name ? associationLine.businessObject.$parent.name : '');
                }
            })
        }
        const prefix = is(element, consts.PROCESS_INPUT_DATA_MAP_OBJECT) ? 'Input_' + element.businessObject.inputFor : 'Output';
        return prefix + (targetNodeNames.length > 0 ? '_' + targetNodeNames : '');
    }
    const adjustNameOfNode = () => {
        const nameShouldBe = computeNameOfNode();
        if( element.businessObject.name !== nameShouldBe ) {
            modeling.updateProperties(element, {name: nameShouldBe});
        }
    }
    adjustNameOfNode();

    return '';
}

function PlanqkRadioChoice(props) {
    const {
        id,
        element,
        title = 'please select',
        choices
    } = props;
    const [open, setOpen] = useLayoutState(['groups', id, 'open'], false);
    const toggleOpen = () => {
        setOpen(!open);
    };
    const ref = useShowEntryEvent(id);
    const modeling = useService("modeling");

    const checked = (property,choice) => {
        if( property === "inputFor" ) {
            return element.businessObject.inputFor === choice
        } else if(property === "visibility") {
            return element.businessObject.visibility === choice
        }
        return false;
    }

    const onChange = (value) => {
        if( value.currentTarget.name === "propertyGroup-inputFor" ) {
            modeling.updateProperties(element, {
                inputFor: value.currentTarget.id,
            });
        } else {
            modeling.updateProperties(element, {
                visibility: value.currentTarget.id,
            });
        }
    };

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
                                title: title,
                                children: title
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
                                class: "planqk-properties-panel-radio-choice-item-set bio-properties-panel-entry",
                                title: title,
                                children: [
                                    jsx(
                                        "div", {
                                            class: "planqk-properties-panel-radio-choice-item",
                                            children: [
                                                jsx(
                                                    "label", {
                                                        for: choices[0],
                                                        class: "bio-properties-panel-label",
                                                        children: choices[0]
                                                    }
                                                ),
                                                jsx(
                                                    "input", {
                                                        ref: ref,
                                                        id: choices[0],
                                                        name: 'propertyGroup-' + id,
                                                        selection: choices[0],
                                                        type: "radio",
                                                        checked: checked(id,choices[0]),
                                                        onChange,
                                                    }
                                                ),
                                            ]
                                        },
                                    ),
                                    jsx(
                                        "div", {
                                            class: "planqk-properties-panel-radio-choice-item",
                                            children: [
                                                jsx(
                                                    "label", {
                                                        for: choices[1],
                                                        class: "bio-properties-panel-label",
                                                        children: choices[1]
                                                    }
                                                ),
                                                jsx(
                                                    "input", {
                                                        ref: ref,
                                                        id: choices[1],
                                                        name: 'propertyGroup-' + id,
                                                        selection: choices[1],
                                                        type: "radio",
                                                        checked: checked(id,choices[1]),
                                                        onChange,
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
