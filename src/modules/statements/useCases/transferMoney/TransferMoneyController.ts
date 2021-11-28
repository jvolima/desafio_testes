import { Request, Response } from "express"
import { container } from "tsyringe";
import { TransferMoneyUseCase } from "./TransferMoneyUseCase";

class TransferMoneyController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { recipient_id } = request.params;

    const { amount, description } = request.body;

    const transferMoneyUseCase = container.resolve(TransferMoneyUseCase);

    const transfer = await transferMoneyUseCase.execute({
      sender_id,
      recipient_id,
      amount,
      description
    });

    return response.json(transfer);
  }
}

export { TransferMoneyController }
