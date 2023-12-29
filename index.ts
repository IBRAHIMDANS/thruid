#!/usr/bin/env node
import {Command} from 'commander';
import * as crypto from "crypto";

import {PostMessageUseCase} from "./src/post-message.usecase";
import {EditMessageCommand, PostMessageCommand} from "./src/message";

import {FileSystemMessageRepository} from "./src/message.fs.repository";


import {ViewTimelineUsecase} from "./src/view-timeline.usecase";
import {EditMessageUseCase} from "./src/edit-message.usecase";

class DateProvider implements DateProvider {
    getNow(): Date {
        return new Date();
    }
}

const program = new Command();
const messageRepository = new FileSystemMessageRepository();

const dateProvider = new DateProvider();

const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider)
const editMessageUseCase = new EditMessageUseCase(messageRepository)
const viewTimelineUseCase = new ViewTimelineUsecase(messageRepository, dateProvider)
program
    .version('1.0.0')
    .description('Thruid CLI')
    .addCommand(
        new Command('post')
            .argument('<user>', 'the current user')
            .argument('<message>', 'the message to post')
            .action(async (user, message) => {
                const postMessageCommand: PostMessageCommand = {
                    id: crypto.randomBytes(16).toString('hex'),
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
    .addCommand(
        new Command('edit')
            .argument('<message-id>', 'the message id of the message to edit')
            .argument('<message>', 'the next message')
            .action(async (messageId, message) => {
                const editMessageCommand: EditMessageCommand = {
                    id: messageId,
                    text: message,
                }
                try {
                    await editMessageUseCase.handle(editMessageCommand);
                    console.log('Message are edited successfully')
                    // console.table([messageRepository.message])
                    process.exit(0)
                } catch (e) {
                    console.log(e.message, "<---- error")
                    process.exit(1)
                }
            })
            .alias('p')
    )
    .addCommand(
        new Command('view')
            .argument('<user>', 'the current user')
            .action(async (user) => {
                try {
                    const timeline = await viewTimelineUseCase.handle(user)
                    console.table(timeline)
                    process.exit(0)
                } catch (e) {
                    console.log(e.message, "<---- error")
                    process.exit(1)
                }
            })
            .alias('v')
    )
;


async function main() {
    await program.parseAsync(process.argv);
}

void main()
