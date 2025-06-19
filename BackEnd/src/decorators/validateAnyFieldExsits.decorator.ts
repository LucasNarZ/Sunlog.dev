import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'ValidateIfAnyFieldExists', async: false })
export class ValidateAnyFieldExists implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as Record<string, any>;
    return Object.values(object).some(value => value !== undefined);
  }

  defaultMessage() {
    return 'At least one field must be provided.';
  }
}
