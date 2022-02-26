import Ajv from 'ajv';
import { JSONSchema6 } from 'json-schema';

function validateParamWithData<T>(
  param: any,
  schema: JSONSchema6,
):
  | {
      result: true;
      data: T;
    }
  | {
      result: false;
      errorMessage: string;
    } {
  try {
    const jsonValidator = new Ajv({
      coerceTypes: true,
      useDefaults: true,
      removeAdditional: true,
    });
    const validate = jsonValidator.compile(schema);
    const data = param;
    const valid = validate(data);
    if (valid === false) {
      console.info(validate.errors);
    }
    const result = typeof valid === 'boolean' ? valid : false;
    return {
      result,
      data,
      errorMessage: typeof valid === 'boolean' && !valid && !!validate.errors ? validate.errors[0].message ?? '' : '',
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      errorMessage: 'catch validate error',
    };
  }
}

export default validateParamWithData;
