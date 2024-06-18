import * as consts from "../Constants";
export default class DataFlowPaletteProvider {
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

    function createDataMapObject(event) {
      createDataObject(event, consts.DATA_MAP_OBJECT);
    }

    function createProcessInputDataMapObject(event) {
      createDataObject(event, consts.PROCESS_INPUT_DATA_MAP_OBJECT);
    }

    function createProcessOutputDataMapObject(event) {
      createDataObject(event, consts.PROCESS_OUTPUT_DATA_MAP_OBJECT);
    }

    function createDataObject(event, dataObjectType) {
      const businessObject = bpmnFactory.create(dataObjectType);
      businessObject.name = businessObject.id;

      let shape = elementFactory.createShape({
        type: dataObjectType,
        businessObject: businessObject,
      });

      create.start(event, shape);
    }

    // start creation of a TransformationTask
    // function createTransformationTask(event) {
    //   const businessObject = bpmnFactory.create(consts.TRANSFORMATION_TASK);
    //   let shape = elementFactory.createShape({
    //     type: consts.TRANSFORMATION_TASK,
    //     businessObject: businessObject,
    //   });
    //   create.start(event, shape);
    // }

    return {
      // add separator line to delimit the new group
      "dataflow-separator": {
        group: "dataflowExt",
        separator: true,
      },
      "create.dataflow-data-map-object": {
        group: "dataflowExt",
        className: "dataflow-data-map-object-palette-icon",
        title: translate("Creates a Data Map Object to model data items"),
        action: {
          click: createDataMapObject,
          dragstart: createDataMapObject,
        },
      },
      "create.dataflow-process-input-data-map-object": {
        group: "dataflowExt",
        className: "dataflow-process-input-data-map-object-palette-icon",
        title: translate(
          "Creates a Data Map Object to model data items that map to input data of the workflow"
        ),
        action: {
          click: createProcessInputDataMapObject,
          dragstart: createProcessInputDataMapObject,
        },
      },
      "create.dataflow-process-output-data-map-object": {
        group: "dataflowExt",
        className: "dataflow-process-output-data-map-object-palette-icon",
        title: translate(
          "Creates a Data Map Object to model data items that map to output data of the workflow"
        ),
        action: {
          click: createProcessOutputDataMapObject,
          dragstart: createProcessOutputDataMapObject,
        },
      },
      // "create.data-flow-transformation-task": {
      //   group: "dataflowExt",
      //   className: "dataflow-transformation-task-palette-icon",
      //   title: translate("Creates a task ot specify data transformations in"),
      //   action: {
      //     click: createTransformationTask,
      //     dragstart: createTransformationTask,
      //   },
      // },
    };
  }
}

DataFlowPaletteProvider.$inject = [
  "bpmnFactory",
  "create",
  "elementFactory",
  "palette",
  "translate"
];
