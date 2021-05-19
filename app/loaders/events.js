import EventEmitter from 'events';
import cleanDownloads from '../events/cleanDownloads';
import cleanOrders from '../events/cleanOrders';
import handleOrders from '../events/handleOrders';

const events = new EventEmitter();

events.on('clearDownloads', cleanDownloads);
events.on('clearOrders', cleanOrders);
events.on('handleOrders', handleOrders);

export default events;
