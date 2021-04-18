import EventEmitter from 'events';
import orderEvent from '../events/order';

const events = new EventEmitter();

events.on('order', orderEvent);

export default events;
