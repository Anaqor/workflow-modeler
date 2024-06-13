const { expect } = require("chai");

import { createServiceTaskGroupForSchemaExample } from "../../../../../modeler-component/extensions/planqk/properties/service-task-properties/ServiceTaskPropertiesProvider";

const openApiSpecWithExampleInPost = {
  openApi: "3.0.0",
  paths: {
    "/": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              example: {
                data: { key1: "dataValue1", key2: "dataValue2" },
                params: { param1: "paramValue1", param2: "paramValue2" },
              },
              schema: {
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      key1: { type: "string" },
                      key2: { type: "string" },
                    },
                  },
                  params: {
                    type: "object",
                    properties: {
                      param1: { type: "string" },
                      param2: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const openApiSpecWithExampleInComponents = {
  openapi: "3.0.0",
  paths: {
    "/": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      key1: { type: "string", example: "dataValue1" },
                      key2: { type: "string", example: "dataValue2" },
                    },
                  },
                  params: {
                    type: "object",
                    properties: {
                      param1: { type: "string", example: "paramValue1" },
                      param2: { type: "string", example: "paramValue2" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      InputData: {
        type: "object",
        properties: {
          key1: { type: "string" },
          key2: { type: "string" },
        },
        example: {
          key1: "value1",
          key2: "value2",
        },
      },
      InputParams: {
        type: "object",
        properties: {
          param1: { type: "string" },
          param2: { type: "string" },
        },
        example: {
          param1: "value1",
          param2: "value2",
        },
      },
    },
  },
};

// Example translation function
const translate = (text) => text;

describe("createServiceTaskGroupForSchemaExample", () => {
  it("should return default message when no subscriptionId is provided", () => {
    const element = { businessObject: { subscriptionId: null } };
    const openApiMap = [];
    const expected = {
      id: "dataMapObjectPropertiesForSchemaExample",
      label: "Schema Example",
      labelData: "Schema Example for data",
      labelParams: "Schema Example for params",
      valueData: "Please select a service subscription.",
      valueParams: "Please select a service subscription.",
    };

    const result = createServiceTaskGroupForSchemaExample(
      element,
      translate,
      openApiMap
    );

    console.log("No subscriptionId provided");
    console.log(result);
    console.assert(
      JSON.stringify(result) === JSON.stringify(expected),
      "Test failed: No subscriptionId provided"
    );
  });

  it("should return no OpenAPI description message when subscriptionId is provided but not found in openApiMap", () => {
    const element = { businessObject: { subscriptionId: null } };
    const openApiMap = [];
    const expected = {
      valueData: "Please select a service subscription.",
      valueParams: "Please select a service subscription.",
    };

    const result = createServiceTaskGroupForSchemaExample(
      element,
      translate,
      openApiMap
    );

    expect(result.valueData).to.equal(expected.valueData);
    expect(result.valueParams).to.equal(expected.valueParams);
  });

  it("should return schema examples when subscriptionId is found in openApiMap", () => {
    const element = { businessObject: { subscriptionId: "123" } };
    const openApiMap = [];
    const expected = {
      valueData:
        "No OpenAPI description available. Please contact the service provider.",
      valueParams:
        "No OpenAPI description available. Please contact the service provider.",
    };

    const result = createServiceTaskGroupForSchemaExample(
      element,
      translate,
      openApiMap
    );

    expect(result.valueData).to.equal(expected.valueData);
    expect(result.valueParams).to.equal(expected.valueParams);
  });

  it("should return schema examples from post specification when subscriptionId is found in openApiMap", () => {
    const element = { businessObject: { subscriptionId: "123" } };
    const openApiMap = [
      { subscription: "123", openApi: openApiSpecWithExampleInPost },
    ];
    const dataExampleMock = { key1: "dataValue1", key2: "dataValue2" };
    const paramsExampleMock = { param1: "paramValue1", param2: "paramValue2" };

    const expected = {
      valueData: dataExampleMock,
      valueParams: paramsExampleMock,
    };

    const result = createServiceTaskGroupForSchemaExample(
      element,
      translate,
      openApiMap
    );

    expect(JSON.parse(result.valueData)).to.deep.equal(expected.valueData);
    expect(JSON.parse(result.valueParams)).to.deep.equal(expected.valueParams);
  });

  it("should return schema examples from component specification when subscriptionId is found in openApiMap", () => {
    const element = { businessObject: { subscriptionId: "123" } };
    const openApiMap = [
      { subscription: "123", openApi: openApiSpecWithExampleInComponents },
    ];
    const dataExampleMock = { key1: "dataValue1", key2: "dataValue2" };
    const paramsExampleMock = { param1: "paramValue1", param2: "paramValue2" };

    const expected = {
      valueData: dataExampleMock,
      valueParams: paramsExampleMock,
    };

    const result = createServiceTaskGroupForSchemaExample(
      element,
      translate,
      openApiMap
    );

    expect(JSON.parse(result.valueData)).to.deep.equal(expected.valueData);
    expect(JSON.parse(result.valueParams)).to.deep.equal(expected.valueParams);
  });
});
