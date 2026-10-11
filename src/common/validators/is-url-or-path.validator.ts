import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUrlOrPath', async: false })
export class IsUrlOrPathConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value !== 'string') return false;
    if (value === '') return true;

    // مسیر نسبی
    if (value.startsWith('/')) return true;
    if (/^[a-zA-Z0-9_\-./]+$/.test(value) && !value.includes('://')) {
      return true;
    }

    // URL کامل
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return '$property must be a valid URL or a relative path';
  }
}

export function IsUrlOrPath(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUrlOrPathConstraint,
    });
  };
}
