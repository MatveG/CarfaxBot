import EventEmitter from 'events';
import orderEvent from '../events/orderSubmit';
import parserError from '../events/parserError';

const events = new EventEmitter();

events.on('orderEvent', orderEvent);
events.on('parserError', parserError);

export default events;
