import {
  isTextFieldEntryEdited,
  TextAreaEntry,
  useShowEntryEvent,
} from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";
import { jsx, jsxs } from "@bpmn-io/properties-panel/preact/jsx-runtime";

/**
 * Properties group for the properties panel. Contains entries for all attributes for the PlanQK Data Pool.
 *
 * @param element The element the properties are from.
 * @return {[{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element}]}
 * @constructor
 */
export default function DataMapProperties(element) {
  return [
    {
      id: "schemaExample",
      element,
      component: SchemaExample,
      isEdited: isTextFieldEntryEdited,
    },

    {
      id: "inputFor",
      element,
      component: PlanqkRadioChoice,
      label: "Input For",
      title: "Input For",
      choices: ["data", "param"],
      isEdited: isTextFieldEntryEdited,
    },

    {
      id: "visibility",
      element,
      component: PlanqkRadioChoice,
      label: "Visibility",
      title: "Visibility",
      choices: ["private", "public"],
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

/**
 * TextAreaEntry for the data pool description attribute.
 *
 * @param props
 * @return {preact.VNode<any>}
 * @constructor
 */
function SchemaExample(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");
  const modeling = useService("modeling");

  const getValue = () => {
    return element.businessObject.schemaExample;
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      schemaExample: value,
    });
  };

  return TextAreaEntry({
    element,
    id: "data_map_description",
    label: translate("Schema Example"),
    description: translate(
      "Provide an OpenAPI specification example of the schema."
    ),
    getValue,
    setValue,
    debounce,
    rows: 3,
  });
}

/**
 * TextAreaEntry for the data pool description attribute.
 *
 * @param props
 * @return {preact.VNode<any>}
 * @constructor
 */
function PlanqkRadioChoice(props) {
  const { id, element, label, title, choices } = props;

  const modeling = useService("modeling");

  const checked = (property, choice) => {
    if (property === "inputFor") {
      return element.businessObject.inputFor === choice;
    } else if (property === "visibility") {
      return element.businessObject.visibility === choice;
    }
    return false;
  };

  const onChange = (value) => {
    if (value.currentTarget.name === "propertySet-inputFor") {
      modeling.updateProperties(element, {
        inputFor: value.currentTarget.id,
      });
    } else {
      modeling.updateProperties(element, {
        visibility: value.currentTarget.id,
      });
    }
  };
  const ref = useShowEntryEvent(id);

  return jsxs("div", {
    class:
      "bio-properties-panel-entry planqk-properties-panel-radio-choice-group",
    children: [
      jsx("div", {
        class: "planqk-properties-panel-radio-choice-group-label",
        title: title,
        children: label,
      }),
      jsx("div", {
        class: "planqk-properties-panel-radio-choice-item-set",
        title: title,
        children: [
          jsx("div", {
            class: "planqk-properties-panel-radio-choice-item",
            children: [
              jsx("label", {
                for: choices[0],
                class: "bio-properties-panel-label",
                children: choices[0],
              }),
              jsx("input", {
                ref: ref,
                id: choices[0],
                name: "propertySet-" + id,
                type: "radio",
                checked: checked(id, choices[0]),
                onChange,
              }),
            ],
          }),
          jsx("div", {
            class: "planqk-properties-panel-radio-choice-item",
            children: [
              jsx("label", {
                for: choices[1],
                class: "bio-properties-panel-label",
                children: choices[1],
              }),
              jsx("input", {
                ref: ref,
                id: choices[1],
                name: "propertySet-" + id,
                type: "radio",
                checked: checked(id, choices[1]),
                onChange,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
