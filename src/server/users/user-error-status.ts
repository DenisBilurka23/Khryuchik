import { UserOperationErrorReason } from "@/types/users";

const STATUS_BY_REASON: Record<UserOperationErrorReason, number> = {
  [UserOperationErrorReason.NotFound]: 404,
  [UserOperationErrorReason.AddressNotFound]: 404,
  [UserOperationErrorReason.EmailTaken]: 409,
  [UserOperationErrorReason.LastAdmin]: 409,
  [UserOperationErrorReason.CannotDemoteSelf]: 409,
  [UserOperationErrorReason.CannotDeleteSelf]: 409,
  [UserOperationErrorReason.EmailManagedByGoogle]: 403,
  [UserOperationErrorReason.WrongPassword]: 403,
  [UserOperationErrorReason.MissingFields]: 400,
  [UserOperationErrorReason.InvalidCountry]: 400,
  [UserOperationErrorReason.InvalidPostalCode]: 400,
};

export const statusForUserOperationError = (reason: UserOperationErrorReason) =>
  STATUS_BY_REASON[reason];
