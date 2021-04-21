import EventEmitter from 'events';
import feedbackSubmit from '../events/feedbackSubmit';
import orderSubmit from '../events/orderSubmit';
import parserError from '../events/parserError';

const events = new EventEmitter();

events.on('orderSubmit', orderSubmit);
events.on('feedbackSubmit', feedbackSubmit);
events.on('parserError', parserError);

export default events;
