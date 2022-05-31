function getProperty<T, K extends keyof T>(object: T, key: K) {
  return object[key];
}

function setProperty<T, K extends keyof T>(
  object: T,
  key: K,
  value: T[K],
) {
  object[key] = value;
}

export {
  getProperty,
  setProperty,
};
