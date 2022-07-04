"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
function mailSend(id_order, email) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer.createTransport({
            host: "smtp.ukr.net",
            port: 465,
            secure: true,
            auth: {
                user: 'andreytsiv@ukr.net',
                pass: 'd2pL1DI85apdQ0Ci',
            },
        });
        let info = yield transporter.sendMail({
            from: '"Anton" <andreytsiv@ukr.net>',
            to: email,
            subject: "order in greenton shop",
            text: "Hello, your order #" + id_order,
            html: "Hello, your order #" + id_order,
        });
        console.log("Message sent: %s", info.messageId);
    });
}
console.log('mailServer is started');
let amqp = require('amqplib/callback_api');
function connectRabbit() {
    amqp.connect('amqp://rabbitmq', function (error0, connection) {
        if (error0) {
            setTimeout(() => {
                console.log('trying to reconnect');
                connectRabbit();
            }, 10000);
        }
        if (!connection) {
            setTimeout(() => {
                console.log('trying to reconnect');
                connectRabbit();
            }, 10000);
        }
        else
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    console.log('error1');
                    throw error1;
                }
                const queue = 'mail';
                channel.assertQueue(queue, {
                    durable: false
                });
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
                channel.consume(queue, function (msg) {
                    console.log(msg.content.toString());
                    let { order_id, email } = JSON.parse(msg.content.toString());
                    mailSend(order_id, email).catch(console.error);
                }, {
                    noAck: true
                });
            });
    });
}
connectRabbit();
//# sourceMappingURL=mail.js.map