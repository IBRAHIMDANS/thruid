#!/usr/bin/env node
import {Command} from 'commander';
import {PostMessageCommand, PostMessageUseCase} from "./src/post-message.usecase";
import {InMemoryMessageRepository} from "./src/message.inmemory.usecase";

class DateProvider implements DateProvider {
    getNow(): Date {
        return new Date();
    }
}

const program = new Command();
const messageRepository = new InMemoryMessageRepository();
const dateProvider = new DateProvider();
const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)
program
    .version('1.0.0')
    .description('Thruid CLI')
    .addCommand(
        new Command('post')
            .argument('<user>', 'the current user')
            .argument('<message>', 'the message to post')
            .action((user, message) => {
                const postMessageCommand: PostMessageCommand = {
                    id: 'message-id',
                    text: message,
                    author: user
                }
                try {
                    postMessageUseCase.handle(postMessageCommand);
                    console.log('Message posted')
                    console.table([messageRepository.message])
                    process.exit(0)
                } catch (e) {
                    console.log(e.message, "<---- error")
                    process.exit(1)
                }
            })
            .alias('p')
    )
;


async function main() {
    await program.parseAsync(process.argv);
}

void main()
