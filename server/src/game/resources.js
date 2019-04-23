const WILDCARDS = {
  "<food>": ["fish", "meat", "bread"]
};

export function missingResources(required, resources) {
  return Object.entries(required)
    .filter(([resource, amount]) =>
      WILDCARDS[resource]
        ? !WILDCARDS[resource].some(x => resources[x] >= amount)
        : resources[resource] < amount
    )
    .map(([resource]) => resource);
}

export function spendResources(cost, resources) {
  Object.entries(cost).forEach(([resource, amount]) => {
    if (WILDCARDS[resource]) {
      const actualResource = WILDCARDS[resource].find(
        x => resources[x] >= amount
      );
      resources[actualResource] -= amount;
    } else {
      resources[resource] -= amount;
    }
  });
}

export function produceResources(produced, resources) {
  Object.entries(produced).forEach(([resource, amount]) => {
    resources[resource] += amount;
  });
}

export function reclaimResources(cost, resources) {
  Object.entries(cost).forEach(([resource, amount]) => {
    resources[resource] += Math.floor(amount / 2);
  });
}
