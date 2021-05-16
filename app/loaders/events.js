import EventEmitter from 'events';
import clearDownloads from '../events/clearDownloads';
import clearOrders from '../events/clearOrders';
import processOrders from '../events/processOrders';
import reportError from '../events/reportError';
import sendReports from '../events/sendReports';
import submitFeedback from '../events/submitFeedback';
import submitOrder from '../events/submitOrder';

const events = new EventEmitter();

events.on('clearDownloads', clearDownloads);
events.on('clearOrders', clearOrders);
events.on('processOrders', processOrders);
events.on('reportError', reportError);
events.on('sendReports', sendReports);
events.on('submitFeedback', submitFeedback);
events.on('submitOrder', submitOrder);

export default events;
