import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { ITransferMoneyDTO } from "../useCases/transferMoney/ITransferMoneyDTO";
import { ITransferResponse } from "../useCases/transferMoney/ITransferResponse";
import { IStatementsRepository } from "./IStatementsRepository";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
  TRANSFERRED = 'transferred'
}

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit' || operation.type === 'transferred') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }

  async transfer({
    sender_id,
    recipient_id,
    amount,
    description,
  }: ITransferMoneyDTO): Promise<ITransferResponse> {
    const senderStatement = this.repository.create({
      user_id: sender_id,
      amount,
      description,
      type: OperationType.TRANSFER
    });

    const transfer = await this.repository.save(senderStatement);

    const recipientStatement = this.repository.create({
      id: transfer.id,
      user_id: recipient_id,
      amount,
      description,
      type: OperationType.TRANSFERRED
    });

    await this.repository.save(recipientStatement)

    const transferResponse = {
      id: transfer.id,
      sender_id,
      amount,
      description,
      type: 'transfer',
      created_at: transfer.created_at,
      updated_at: transfer.updated_at
    }

    return transferResponse as ITransferResponse;
  }
}
