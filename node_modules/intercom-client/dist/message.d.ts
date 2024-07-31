import { Client } from '.';
import { MessageObject, MessageType } from './message/message.types';
export default class Message {
    private readonly client;
    private messagesBaseUrl;
    constructor(client: Client);
    create({ messageType: message_type, subject, body, template, from, to, createConversationWithoutContactReply: create_conversation_without_contact_reply, }: CreateMessageBody): Promise<MessageObject>;
}
interface CreateMessageRequest {
    message_type: MessageType;
    body: string;
    from: Recipient;
    to: Recipient;
    subject?: string;
    template?: string;
    create_conversation_without_contact_reply?: boolean;
}
interface CreateMessageBody extends Omit<CreateMessageRequest, 'message_type' | 'create_conversation_without_contact_reply'> {
    messageType: MessageType;
    createConversationWithoutContactReply?: boolean;
}
type Recipient = {
    id: string;
    type: RecipientType;
};
export declare enum RecipientType {
    ADMIN = "admin",
    USER = "user",
    LEAD = "lead"
}
export {};
//# sourceMappingURL=message.d.ts.map