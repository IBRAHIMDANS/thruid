import {EditMessageCommand, MessageText} from "./message";
import {MessageRepository} from "./message.repository";


export class EditMessageUseCase {
    constructor(private messageRepository: MessageRepository) {
    }

    async handle(editMessageCommand: EditMessageCommand) {

        const messageToEdit = await this.messageRepository.getMessageById(editMessageCommand.id)
        if (!messageToEdit) {
            throw new Error(`Message with id ${editMessageCommand.id} not found`)
        }

        const text = MessageText.of(editMessageCommand.text)

        const editedMessage = {
            ...messageToEdit,
            text,
        };

        await this.messageRepository.save(editedMessage)
    }
}
