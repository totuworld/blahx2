const isOfType = <T>(varToBeChecked: unknown, propertyToCheckFor: keyof T): varToBeChecked is T =>
  (varToBeChecked as T)[propertyToCheckFor] !== undefined;

export default isOfType;
