#!/usr/bin/env node
import {Command} from 'commander';
import {PostMessageCommand, PostMessageUseCase} from "./src/post-message.usecase";
import {FileSystemMessageRepository} from "./src/message.fs.repository";

class DateProvider implements DateProvider {
    getNow(): Date {
        return new Date();
    }
}

const program = new Command();
const messageRepository = new FileSystemMessageRepository();
const dateProvider = new DateProvider();
const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)
program
    .version('1.0.0')
    .description('Thruid CLI')
    .addCommand(
        new Command('post')
            .argument('<user>', 'the current user')
            .argument('<message>', 'the message to post')
            .action(async (user, message) => {
                const postMessageCommand: PostMessageCommand = {
                    id: 'message-id',
                    text: message,
                    author: user
                }
                try {
                    await postMessageUseCase.handle(postMessageCommand);
                    console.log('Message posted')
                    // console.table([messageRepository.message])
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
