import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects.js';

interface Event {
  subject: Subjects;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        }
        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}
