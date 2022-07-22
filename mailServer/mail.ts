
"use strict";

import { hasUncaughtExceptionCaptureCallback } from "process";

const nodemailer = require("nodemailer");


async function mailSend(id_order:string, email:string) {

  let transporter = nodemailer.createTransport({
    host: "smtp.ukr.net",
    port: 465,
    secure: true, 
    auth: {
      user: 'andreytsiv@ukr.net', 
      pass: 'd2pL1DI85apdQ0Ci', 
    },
  });

  let info = await transporter.sendMail({
    from: '"Anton" <andreytsiv@ukr.net>', 
    to: email, 
    subject: "order in greenton shop", 
    text: "Hello, your order #" + id_order , 
    html: "Hello, your order #" + id_order, 
  });

  console.log("Message sent: %s", info.messageId);
}

console.log('mailServer is started');

let amqp = require('amqplib/callback_api');

function connectRabbit(){
    
    amqp.connect('amqp://rabbitmq', function(error0: Error, connection) {
    if (error0) {
        setTimeout(()=>{
            console.log('trying to reconnect');
            connectRabbit();
        },10000)
        
    }else if(!connection){
        setTimeout(()=>{
            console.log('trying to reconnect2');
            connectRabbit();
        },10000)
    } else     connection.createChannel(function(error1, channel) {
        if (error1) {
            console.log('error1');
            throw error1;
        }

        const queue = 'mail';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(msg.content.toString());
            let {order_id, email} = JSON.parse(msg.content.toString());

            mailSend(order_id, email).catch(console.error);
        }, {
            noAck: true
        });
    });
});
}

connectRabbit();