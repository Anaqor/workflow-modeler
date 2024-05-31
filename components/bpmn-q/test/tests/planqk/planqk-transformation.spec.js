const { expect } = require("chai");
const {
  setPluginConfig,
} = require("../../../modeler-component/editor/plugin/PluginConfigHandler");
const {
  startPlanqkReplacementProcess,
} = require("../../../modeler-component/extensions/planqk/exec-completion/PlanQKServiceTaskCompletion");
const { validPlanqkDiagram } = require("../helpers/DiagramHelper");
const {
  createTempModelerFromXml,
} = require("../../../modeler-component/editor/ModelerHandler");
const app1 = {
  id: "app1",
  description: "",
  attributes: null,
  groups: [],
  name: "Seppones App",
  subscriptionCount: 2,
};
const api1 = {
  id: "api1",
  name: "Seppones API",
  gatewayEndpoint: "www.seppone-gateway.de/api1",
  version: "v1",
  context: "/api1",
};
const api2 = {
  id: "api2",
  name: "Felixs API",
  gatewayEndpoint: "www.felix-gateway.de/api1",
  version: "v1",
  context: "/api1",
};
const sub1 = { id: "sub1", application: app1, api: api1 };
const sub2 = { id: "sub2", application: app1, api: api2 };
const app2 = {
  id: "app2",
  description: "",
  attributes: null,
  groups: [],
  name: "Falkis App",
  subscriptionCount: 1,
};
const api3 = {
  id: "api3",
  name: "Wuddis API",
  gatewayEndpoint: "www.wuddi-gateway.de/api1",
  version: "v1",
  context: "/api3",
};
const sub3 = { id: "sub3", application: app2, api: api3 };

const dp1 = {
  name: "Anomaly Detection: Bars & Stipes Dataset ",
  id: "2a7d74a6-0fb5-400a-8f0c-7125aef5613e",
  link: "https://platform.planqk.de/datapools/2a7d74a6-0fb5-400a-8f0c-7125aef5613e/",
  description:
    "A synthetic dataset for the anomaly detection. There are two version of the dataset, a larger version consisting of 3x3 pixel images of bars and stripes and a small version of 2x2 pixel images. We provide pretrained models for both of these datasets to be used with the AnoGan service.",
};
const dp2 = {
  name: "Infinite Data Pool",
  id: "2a7d74a6-0fb5-400a-asd3-7125aef5613e",
  link: "https://platform.planqk.de/datapools/2a7d74a6-0fb5-400a-asd3-7125aef5613e/",
  description:
    "A dataset with an infinite amount of data to train endless models.",
};
const dp3 = {
  name: "Small Data Pool",
  id: "2a7d74a6-adsa-400a-8f0c-7125aef5613e",
  link: "https://platform.planqk.de/datapools/2a7d74a6-adsa-400a-8f0c-7125aef5613e/",
  description: "Replace this by a real description",
};
describe("Test the PlanQKServiceTaskCompletion of the PlanQK extension.", function () {
  describe("Transformation of PlanQK extensions", function () {
    let result, modeler, subProcessBos, sequenceFlowBos;
    before(async function () {
      setPluginConfig([
        {
          name: "dataflow",
          config: {},
        },
        {
          name: "planqk",
          config: {
            serviceEndpointBaseUrl: "http://dummy.com",
            subscriptions: [sub1, sub2, sub3],
            tokenUrl: "http://tokenendpoint.com",
            oauthInfoByAppMap: {
              app1: {
                consumerKey: "app1ConsumerKey",
                consumerSecret: "app1ConsumerSecret",
              },
              app2: {
                consumerKey: "app2ConsumerKey",
                consumerSecret: "app2ConsumerSecret",
              },
            },
            dataPools: [dp1, dp2, dp3],
          },
        },
        {
          name: "quantme",
          config: {
            test: "test",
          },
        },
      ]);
      result = await startPlanqkReplacementProcess(validPlanqkDiagram);
      modeler = await createTempModelerFromXml(result.xml);
      const elementRegistry = modeler.get("elementRegistry");
      subProcessBos = elementRegistry
        .filter(function (element) {
          return element.type === "bpmn:SubProcess";
        })
        .map((subProcess) => subProcess.businessObject);
      sequenceFlowBos = elementRegistry
        .filter(function (element) {
          return element.type === "bpmn:SequenceFlow";
        })
        .map((sequenceFlow) => sequenceFlow.businessObject);
    });

    it("should create a valid transformed workflow", async function () {
      expect(result.status).to.equal("transformed");

      // check that all extension elements are replaced
      expect(result.xml).to.not.contain("planqk:");
    });

    it("subprocess execution order should reflect modeled order of PlanQK service tasks", function () {
      const circuitGeneration = subProcessBos.find(
        (sub) => sub.name === "CircuitGeneration"
      );
      const circuitExecution = subProcessBos.find(
        (sub) => sub.name === "CircuitExecution"
      );

      const flowFromCGtoCE = sequenceFlowBos.find(
        (flow) =>
          flow.sourceRef.id === circuitGeneration.id &&
          flow.targetRef.id === circuitExecution.id
      );
      expect(
        flowFromCGtoCE,
        "CircuitGeneration should flow directly into CircuitExecution"
      ).to.exist;
    });

    it("subprocesses properties should be generated correctly based on service task properties", function () {
      const circuitExecution = subProcessBos.find(
        (sub) => sub.name === "CircuitExecution"
      );
      const inputOutput = circuitExecution.extensionElements.values.find(
        (ext) => ext.$type === "camunda:InputOutput"
      );

      const expectedParams = {
        executionState: undefined,
        executionId: undefined,
        serviceEndpoint:
          "https://gateway.34.90.225.20.nip.io/1f8def58-8ecb-4098-bf4c-83b41c950222/circuitexecution/1.0.0",
        tokenEndpoint: "https://gateway.34.90.225.20.nip.io/token",
        consumerSecret: "rugfjg7lrcOwQj_iEgiYwdOigeIa",
        consumerKey: "sDYssKpmJhLnSTipziPf3HlmgJwa",
        serviceName: "CircuitExecution",
        applicationName: "MyApp",
      };

      const params = inputOutput.inputParameters;
      expect(
        inputOutput.inputParameters.length,
        "There should be 8 input parameters"
      ).to.equal(8);

      for (const expParam in expectedParams) {
        const param = params.find((p) => p.name === expParam);
        expect(param, `${expParam} should be defined`).to.exist;
        expect(param.value, `${expParam} should be correctly set`).to.equal(
          expectedParams[expParam]
        );
      }
    });

    it("should verify the correct execution order in subprocess", function () {
      // Locate the 'CircuitGeneration' subprocess
      const circuitGeneration = subProcessBos.find(
        (sub) => sub.name === "CircuitGeneration"
      );

      // Starting point is assumed to be the StartEvent
      let lastTargetRef = circuitGeneration.flowElements.find(
        (el) => el.$type === "bpmn:StartEvent"
      );

      // Define the expected sequence of elements with details on type and specific properties
      const expectedSequence = [
        { name: "Call Service CircuitGeneration", type: "bpmn:ServiceTask" },
        {
          name: "Service State Polling Timer",
          type: "bpmn:IntermediateCatchEvent",
          eventDefinitionType: "bpmn:TimerEventDefinition",
        },
        {
          name: "Poll Response from Service CircuitGeneration",
          type: "bpmn:ServiceTask",
        },
        { name: "Service State Gateway", type: "bpmn:ExclusiveGateway" },
        {
          name: "Get Result from Service CircuitGeneration",
          type: "bpmn:ServiceTask",
        },
      ];

      expectedSequence.forEach((element) => {
        // Find the sequence flow leading from the last target
        const flow = sequenceFlowBos.find(
          (flow) => flow.sourceRef.id === lastTargetRef.id
        );
        expect(
          flow,
          `Flow should exist from ${lastTargetRef.name || lastTargetRef.id}`
        ).to.exist;

        // Identify the next element targeted by this flow
        const nextElement = circuitGeneration.flowElements.find(
          (el) => el.id === flow.targetRef.id && el.$type === element.type
        );

        // Special handling for IntermediateCatchEvent with TimerEventDefinition
        if (element.type === "bpmn:IntermediateCatchEvent") {
          const timerDefinition = nextElement.eventDefinitions.find(
            (def) => def.$type === element.eventDefinitionType
          );
          expect(timerDefinition, `Element should have a timer definition`).to
            .exist;
        }

        // Assert the element's name (if provided) matches the expected
        if (element.name) {
          expect(
            nextElement.name,
            `Element should be '${element.name}'`
          ).to.equal(element.name);
        }

        // Update lastTargetRef to the current element for the next iteration
        lastTargetRef = nextElement;
      });
    });
  });
});
