import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects.js';

interface Event {
  subject: Subjects;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;

  abstract onMessage(data: T['data'], msg: Message): void | Promise<void>;
  private client: Stan;
  protected ackWait = 5 * 1000; // default acknowledgment wait time of 5 seconds

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions(),
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${this.queueGroupName} - #${String(msg.getSequence())}`,
      );
      const parsedData = this.parseMessage(msg);
      Promise.resolve(this.onMessage(parsedData, msg)).catch((err: unknown) => {
        console.error('Error processing message', err);
      });
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
