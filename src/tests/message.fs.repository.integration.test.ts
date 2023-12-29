import * as fs from 'fs'
import * as path from 'path'
import {FileSystemMessageRepository} from "../infra/message.fs.repository";
import {messageBuilder} from "./message.builder";
import {afterEach} from "node:test";


describe('FileSystemMessageRepository', () => {
    const testMessagesPath = path.join(__dirname, './message-test.json')
    let messageRepository: FileSystemMessageRepository

    beforeEach(async () => {
        await fs.promises.writeFile(testMessagesPath, JSON.stringify([]))
        messageRepository = new FileSystemMessageRepository(testMessagesPath)
    })

    afterEach(async () => {
        if (fs.existsSync(testMessagesPath)) {
            await fs.promises.unlink(testMessagesPath)
        }
    })

    test('save() can save a message in the file system', async () => {
        // Given a message repository
        // When I save a message
        // Then the message is saved in the file system

        await messageRepository.save(
            messageBuilder()
                .withId('m1')
                .withText('Test Message')
                .publishedAt(new Date("2023-12-26T16:30:00Z"))
                .build()
        )
        const messages = await fs.promises.readFile(testMessagesPath, 'utf-8')
        expect(JSON.parse(messages)).toEqual([{
            id: 'm1',
            text: 'Test Message',
            author: "A",
            publishedAt: '2023-12-26T16:30:00.000Z'
        }])
    })
    test('save() can update existing a message in the file system', async () => {
        // Given a message repository
        // When I update a message
        // Then the message is updated in the file system
        await fs.promises.writeFile(testMessagesPath, JSON.stringify([{
            id: 'm1',
            text: 'Test Message',
            author: "A",
            publishedAt: '2023-12-26T16:30:00.000Z'
        }]))


        await messageRepository.save(
            messageBuilder()
                .withId('m1')
                .withText('Test Message new')
                .publishedAt(new Date("2023-12-26T16:30:00Z"))
                .build()
        )
        const messages = await fs.promises.readFile(testMessagesPath, 'utf-8')

        expect(JSON.parse(messages)).toEqual([{
            id: 'm1',
            text: 'Test Message new',
            author: "A",
            publishedAt: '2023-12-26T16:30:00.000Z'
        }])
    })

    test('getAllOfUser() can retrieve all messages of a user', async () => {
        // Given a message repository
        // And two messages of user A
        // And a message of user B
        // When I retrieve all messages of user A
        // Then I get only the message of user A
        await fs.promises.writeFile(testMessagesPath, JSON.stringify([
            {
                id: 'm1',
                text: 'Test Message',
                author: "A",
                publishedAt: '2023-12-26T16:30:00.000Z'
            },
            {
                id: 'm2',
                text: 'Test Message',
                author: "B",
                publishedAt: '2023-12-26T16:31:00.000Z'
            },
            {
                id: 'm3',
                text: 'Test Message 3',
                author: "A",
                publishedAt: '2023-12-26T16:32:00.000Z'
            }
        ]))
        const aMessages = await messageRepository.getAllOfUser('A')

        expect(aMessages).toHaveLength(2)
        expect(aMessages).toEqual(
            expect.arrayContaining([messageBuilder()
                .withId('m1')
                .withText('Test Message')
                .publishedAt(new Date("2023-12-26T16:30:00Z"))
                .authorBy('A')
                .build(),
                messageBuilder()
                    .withId('m3')
                    .withText('Test Message 3')
                    .publishedAt(new Date("2023-12-26T16:32:00Z"))
                    .authorBy('A')
                    .build()])
        )
    })

    test('getMessageById() can retrieve a message by id', async () => {
        // Given a message repository
        // And two messages of user A
        // And a message of user B
        // When I retrieve all messages of user A
        // Then I get only the message of user A
        await fs.promises.writeFile(testMessagesPath, JSON.stringify([
            {
                id: 'm1',
                text: 'Test Message',
                author: "A",
                publishedAt: '2023-12-26T16:30:00.000Z'
            },
            {
                id: 'm2',
                text: 'Test Message',
                author: "B",
                publishedAt: '2023-12-26T16:31:00.000Z'
            },
            {
                id: 'm3',
                text: 'Test Message 3',
                author: "A",
                publishedAt: '2023-12-26T16:32:00.000Z'
            }]))
        const message = await messageRepository.getMessageById('m3')

        expect(message).toEqual(
            messageBuilder()
                .withId('m3')
                .withText('Test Message 3')
                .publishedAt(new Date("2023-12-26T16:32:00Z"))
                .authorBy('A')
                .build()
        )
    })

})
