import * as consts from "./utilities/Constants";

export default class PlanQKPaletteProvider {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    return this.createPlanqkServiceTaskEntry();
  }

  createPlanqkServiceTaskEntry() {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createPlanQKServiceTask(event) {
      const businessObject = bpmnFactory.create(consts.PLANQK_SERVICE_TASK);
      let shape = elementFactory.createShape({
        type: consts.PLANQK_SERVICE_TASK,
        businessObject: businessObject,
      });
      create.start(event, shape);
    }

    return {
      // add separator line to delimit the new group
      "planqk-separator": {
        group: "planqk",
        separator: true,
      },
      "create.planqk-service-task": {
        group: "planqk",
        className: "qwm-planqk-icon-service-task-palette",
        title: translate(
          "Creates a task that calls a PlanQK service you subscribed to"
        ),
        action: {
          click: createPlanQKServiceTask,
          dragstart: createPlanQKServiceTask,
        },
      },
    };
  }
}

PlanQKPaletteProvider.$inject = [
  "bpmnFactory",
  "create",
  "elementFactory",
  "palette",
  "translate",
];
