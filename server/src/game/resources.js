export function missingResources(required, resources) {
  return Object.entries(required)
    .filter(([resource, amount]) => resources[resource] < amount)
    .map(([resource]) => resource);
}

export function spendResources(cost, resources) {
  Object.entries(cost).forEach(([resource, amount]) => {
    resources[resource] -= amount;
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
