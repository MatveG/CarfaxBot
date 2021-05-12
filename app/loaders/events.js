import EventEmitter from 'events';
import errorParsing from '../events/errorParsing';
import submitFeedback from '../events/submitFeedback';
import submitOrder from '../events/submitOrder';

const events = new EventEmitter();

events.on('errorParsing', errorParsing);
events.on('submitFeedback', submitFeedback);
events.on('submitOrder', submitOrder);

export default events;
