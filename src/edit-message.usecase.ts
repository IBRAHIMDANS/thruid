import {
    EditMessageCommand,
    MessageCannotBeEmptyError,
    MessageCannotOnlyBeSpaceError,
    MessageTooLongError
} from "./message";
import {MessageRepository} from "./message.repository";


export class EditMessageUseCase {
    constructor(private messageRepository: MessageRepository) {
    }

    async handle(editMessageCommand: EditMessageCommand) {

        if (editMessageCommand.text.length === 0) {
            throw new MessageCannotBeEmptyError();
        }
        if (editMessageCommand.text.trim().length === 0) {
            throw new MessageCannotOnlyBeSpaceError();
        }
        if (editMessageCommand.text.length > 280) {
            throw new MessageTooLongError();
        }

        const messageToEdit = await this.messageRepository.getMessageById(editMessageCommand.id)
        if (!messageToEdit) {
            throw new Error(`Message with id ${editMessageCommand.id} not found`)
        }

        messageToEdit.text = editMessageCommand.text

        await this.messageRepository.save(messageToEdit)
    }
}
