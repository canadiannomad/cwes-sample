/*
 * Event: Ping
 * Description: Returns Pong++ to an Async Request
 * Input Payload: PayloadHTTP
 * Output Payload: null
 * State Changes: Increase Ping State
 * Side Effects: Updates Async Request with Output
 * Next: None
 */
import { types } from 'clockwork-event-sourcing';
import { PayloadHTTP } from '../../types';
import db from '../../lib/db';
import returnJson from '../../lib/return-json';
import models from '../../models';

export default class implements types.EventObject {
  listenFor: string[] = ['PayloadHTTP'];

  stateKey = 'ping-state';

  filterEvent = async (event: types.Event<PayloadHTTP>): Promise<boolean> => {
    const input = event.payload;
    return input.call === 'ping' && event.payloadVersion === '0.0.1';
  };

  handleStateChange = async (_event: types.Event<PayloadHTTP>): Promise<void> => {
    const connection = await db();

    // Because I'm mis-using a string field for the sake of example, otherwise I'd use a simple increment.
    const pingState = parseInt((await connection.manager.findOne(models.State, 2))?.position || '0', 10) + 1;
    const state = new models.State();
    state.id = 2;
    state.position = pingState.toString();
    await connection.manager.save(state);
  };

  handleSideEffects = async (event: types.Event<PayloadHTTP>): Promise<null> => {
    const connection = await db();

    const pingState = parseInt((await connection.manager.findOne(models.State, 2))?.position || '0', 10);

    await returnJson(event.requestId, {
      message: 'Pong',
      pingState,
    });

    return null;
  };
}
