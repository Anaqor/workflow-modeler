export function extractDataValue(apiSpec) {
  return getExampleValue(apiSpec, "data");
}

export function extractParamsValue(apiSpec) {
  return getExampleValue(apiSpec, "params");
}

export function extractDataValueRecursively(apiSpec) {
  if (hasPostOperation(apiSpec)) {
    return extractValues(
      apiSpec.paths["/"].post.requestBody.content["application/json"].schema
        .properties.data?.properties
    );
  }
}

export function extractParamsValueRecursively(apiSpec) {
  if (hasPostOperation(apiSpec)) {
    return extractValues(
      apiSpec.paths["/"].post.requestBody.content["application/json"].schema
        .properties.params?.properties
    );
  }
}

function hasPostOperation(apiSpec) {
  return !!(
    apiSpec &&
    apiSpec.paths &&
    apiSpec.paths["/"] &&
    apiSpec.paths["/"].post &&
    apiSpec.paths["/"].post.requestBody &&
    apiSpec.paths["/"].post.requestBody.content &&
    apiSpec.paths["/"].post.requestBody.content["application/json"] &&
    apiSpec.paths["/"].post.requestBody.content["application/json"].schema &&
    apiSpec.paths["/"].post.requestBody.content["application/json"].schema
      .properties
  );
}

function hasExample(apiSpec) {
  return !!(
    hasPostOperation(apiSpec) &&
    apiSpec.paths["/"].post.requestBody.content["application/json"].example
  );
}

function getExampleValue(apiSpec, prop) {
  if (hasExample(apiSpec)) {
    return apiSpec.paths["/"].post.requestBody.content["application/json"]
      .example[prop];
  }
  return undefined;
}

const extractValues = (apiSpec) => {
  const result = {};
  for (const key in apiSpec) {
    if (apiSpec[key].example) {
      result[key] = apiSpec[key].example;
    } else if (apiSpec[key].default) {
      result[key] = apiSpec[key].default;
    } else if (apiSpec[key].type === "object") {
      if (apiSpec[key].properties) {
        result[key] = extractValues(apiSpec[key].properties);
      }
      if (apiSpec[key].additionalProperties) {
        const item = { item: apiSpec[key].additionalProperties };
        const value = extractValues(item).item;
        const additionalProperties = {
          additionalProp1: value,
          additionalProp2: value,
          additionalProp3: value,
        };
        result[key] = { ...result[key], ...additionalProperties };
      }
    } else if (apiSpec[key].type === "array") {
      const item = { item: apiSpec[key].items };
      result[key] = [extractValues(item).item];
    } else if (apiSpec[key].oneOf) {
      const item = { item: apiSpec[key].oneOf[0] };
      result[key] = extractValues(item).item;
    } else if (apiSpec[key].anyOf) {
      const item = { item: apiSpec[key].anyOf[0] };
      result[key] = extractValues(item).item;
    } else if (apiSpec[key].allOf) {
      let compositeResult = {};
      for (const entry of apiSpec[key].allOf) {
        const item = { item: entry };
        compositeResult = { ...compositeResult, ...extractValues(item).item };
      }
      result[key] = compositeResult;
    } else {
      if (apiSpec[key].type === "number" || apiSpec[key].type === "integer") {
        result[key] = 42;
      } else if (apiSpec[key].type === "string" && apiSpec[key].enum) {
        result[key] = apiSpec[key].enum[0];
      } else if (apiSpec[key].type === "string") {
        result[key] = "string";
      } else {
        result[key] = undefined;
      }
    }
  }
  return result;
};
