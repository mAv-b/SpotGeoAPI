type Schema = {
  fields: { [key: string]: string }
  required?: string[]
}

function required(obj: any, required: string[]) {
  for (const key of required) {
    if (obj[key] === undefined)
      return false;
  }

  return true;
}

function validate(obj: any, schema: Schema) {
  if(schema.required){
    const haveRequiredFields = required(obj, schema.required);
    if (!haveRequiredFields) {
      return false;
    }
  }

  for (const key of Object.keys(obj)) {
    if (schema.fields[key] === undefined){
      return false;
    } else if (typeof obj[key] !== schema.fields[key]){
      return false;
    }
  }

  return true;
}

export { validate, required, Schema }