import Ajv, { type ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import loginSchema from '../schemas/login.schema.json';
import usersSchema from '../schemas/users.schema.json';

export type SchemaName =
  | 'loginError'
  | 'loginSuccess'
  | 'user'
  | 'usersList'
  | 'userMutation'
  | 'deletedUser'
  | 'userError';

const ajv = new Ajv({ allErrors: true, strict: false });

addFormats(ajv);

const schemas: Record<SchemaName, object> = {
  loginError: loginSchema.$defs.error,
  loginSuccess: loginSchema.$defs.success,
  user: usersSchema.$defs.user,
  usersList: usersSchema.$defs.list,
  userMutation: usersSchema.$defs.mutation,
  deletedUser: usersSchema.$defs.deleted,
  userError: usersSchema.$defs.error,
};

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  return ajv.errorsText(errors, { separator: '; ' });
}

export function expectSchema(data: unknown, schemaName: SchemaName): void {
  const validate = ajv.compile(schemas[schemaName]);

  if (!validate(data)) {
    throw new Error(
      `Schema validation failed for "${schemaName}": ${formatErrors(validate.errors)}`,
    );
  }
}
