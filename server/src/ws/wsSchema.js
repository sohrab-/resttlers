const buildingTypes = {
  type: "object",
  additionalProperties: {
    type: "object",
    properties: {
      consumes: {
        type: "array",
        items: { type: "string" }
      },
      produces: {
        type: "array",
        items: { type: "string" }
      }
    }
  }
};

const settlements = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      leader: { type: "string" },
      creationTime: { type: "integer" },
      objective: { type: "string" },
      score: { type: "integer" },
      level: { type: "string" },
      resources: {
        additionalProperties: { type: "integer" }
      },
      buildings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string" },
            status: { type: "string" },
            statusReason: { type: "string" }
          }
        }
      }
    }
  }
};

export default {
  type: "object",
  properties: {
    buildingTypes,
    settlements
  }
};
