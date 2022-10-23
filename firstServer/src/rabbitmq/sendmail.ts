export async function connectRabbit(order_id:number, email:string):Promise<void>{

	let amqp = require('amqplib/callback_api');

	amqp.connect('amqp://rabbitmq', function(error0, connection) {
		if (error0) {
			setTimeout(()=>{
				console.log('trying to reconnect');
				connectRabbit(order_id, email);
			},10000)
			
		}
		connection.createChannel(function(error1, channel) {
			if (error1) {
				throw error1;
			}
	
			let queue = 'mail';
			let msg = {
				'order_id': order_id,
				'email': email
			}
	
			channel.assertQueue(queue, {
				durable: false
			});
			channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
	
			console.log(" [x] Sent %s", msg);
		});
		setTimeout(function() {
			connection.close();
		}, 5000);
	});
}
