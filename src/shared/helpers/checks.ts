type Prop = number | string | boolean | undefined | null;

function checkIsEmpty(data: Prop) {
  return (data ?? null) != null;
}

function validateProperties<T, K extends keyof T>(object: T, properties: K[]) {
  let isValid = false;

  for (let i = 0; i < properties.length; i += 1) {
    const data = object[properties[i]] ?? null;

    if (data !== null) {
      isValid = true;
      break;
    }
  }

  if (!isValid) {
    return false;
  }
  return true;
}

function checkProperty<T, K extends keyof T>(object: T, data: Prop, keyProperty: K) {
  const value = object[keyProperty];
  const isValue = (value ?? null) != null;

  if (!checkIsEmpty(data)) {
    return isValue ? value : null;
  }
  return data;
}

function checkFunction<T>(data: T) {
  if (data === null) {
    return null;
  }
  if (typeof data === 'function') {
    return data;
  }

  return null;
}

export {
  checkIsEmpty,
  validateProperties,
  checkProperty,
  checkFunction,
};
