import EventEmitter from 'events';
import getApiData from '../events/getApiData';
import cleanExpiredArchive from '../events/cleanExpiredArchive';
import cleanExpiredOrders from '../events/cleanExpiredOrders';
import fulfillOrders from '../events/fulfillOrders';

const events = new EventEmitter();

events.on('getApiData', async () => await getApiData());
events.on('fulfillOrders', async () => await fulfillOrders());
events.on('cleanExpiredArchive', cleanExpiredArchive);
events.on('cleanExpiredOrders', cleanExpiredOrders);

export default events;
