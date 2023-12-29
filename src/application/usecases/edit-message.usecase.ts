import {MessageRepository} from "../message.repository";
import {EditMessageCommand, Message} from "../domain/message";


export class EditMessageUseCase {
    constructor(private messageRepository: MessageRepository) {
    }

    async handle(editMessageCommand: EditMessageCommand) {

        const message = await this.messageRepository.getMessageById(editMessageCommand.id)

        if (!message) {
            throw new Error(`Message with id ${editMessageCommand.id} not found`)
        }

        message.editText(editMessageCommand.text);

        await this.messageRepository.save(Message.fromData(message))
    }
}
