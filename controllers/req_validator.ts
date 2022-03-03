import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import { JSONSchema6 } from 'json-schema';

const regexPattern =
  '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$';
const dateTimeRegex = new RegExp(regexPattern);

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
    ajvFormats(jsonValidator);
    jsonValidator.addFormat('date-time', dateTimeRegex);
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
