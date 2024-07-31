"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientType = void 0;
var Message = /** @class */ (function () {
    function Message(client) {
        this.client = client;
        this.messagesBaseUrl = 'messages';
        this.client = client;
    }
    Message.prototype.create = function (_a) {
        var message_type = _a.messageType, subject = _a.subject, body = _a.body, template = _a.template, from = _a.from, to = _a.to, create_conversation_without_contact_reply = _a.createConversationWithoutContactReply;
        var data = {
            message_type: message_type,
            subject: subject,
            body: body,
            template: template,
            from: from,
            to: to,
            create_conversation_without_contact_reply: create_conversation_without_contact_reply,
        };
        return this.client.post({
            url: "/".concat(this.messagesBaseUrl),
            data: data,
        });
    };
    return Message;
}());
exports.default = Message;
var RecipientType;
(function (RecipientType) {
    RecipientType["ADMIN"] = "admin";
    RecipientType["USER"] = "user";
    RecipientType["LEAD"] = "lead";
})(RecipientType = exports.RecipientType || (exports.RecipientType = {}));
//# sourceMappingURL=message.js.map