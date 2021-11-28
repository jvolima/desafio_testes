import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferMoneyDTO } from "./ITransferMoneyDTO";
import { TransferMoneyError } from "./TransferMoneyError";

@injectable()
class TransferMoneyUseCase {
  constructor (
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ sender_id, recipient_id, amount, description }: ITransferMoneyDTO) {
    const recipient = await this.usersRepository.findById(recipient_id);

    if(!recipient) {
      throw new TransferMoneyError.RecipientUserNotFound();
    }

    const sender_account = await this.statementsRepository.getUserBalance({
      user_id: sender_id
    });

    const sender_balance = sender_account.balance;

    if(sender_balance < amount) {
      throw new TransferMoneyError.InsufficientFunds();
    }

    const transfer = await this.statementsRepository.transfer({
      sender_id,
      recipient_id,
      amount,
      description
    });

    return transfer;
  }
}

export { TransferMoneyUseCase }
