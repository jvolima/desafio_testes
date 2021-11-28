import { AppError } from "../../../../shared/errors/AppError";


export namespace TransferMoneyError {
  export class RecipientUserNotFound extends AppError {
    constructor() {
      super('Recipient user not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient funds", 400);
    }
  }
}
