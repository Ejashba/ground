import moment from 'moment';
import {
  SET_CONNECTED,
  SET_DISCONNECTED,
  SET_PORT,
  UPDATE_SECONDS_SINCE_CHANGE
} from './types';
import comms from '../comms';

const sensorListeners = [];

export const getAvailablePorts = async () => {
  return await comms.listPorts();
}

export const selectPort = (port, baud) => async dispatch => {
  const success = await comms.selectPort(port, baud);
  if(success) {
    dispatch({
      type: SET_PORT,
      payload: {
        port: port
      }
    });
  }
  return success;
}

export const updateConnState = () => async dispatch => {
  const connected = await comms.getConnected();
  const port = await comms.getPort();
  dispatch({type: connected ? SET_CONNECTED : SET_DISCONNECTED});
  if(port) {
    dispatch({
      type: SET_PORT,
      payload: {
        port
      }
    });
  }
}

export const startConnListen = () => dispatch => {
  comms.connListen(isConnected => {
    dispatch({
      type: isConnected ? SET_CONNECTED : SET_DISCONNECTED
    });
  });
  window.setInterval(() => {
    dispatch({
      type: UPDATE_SECONDS_SINCE_CHANGE
    });
  }, 1000);
}

export const startSensorListen = () => dispatch => {
  comms.sensorListen(payload => {
    sensorListeners.filter(v => v.idx === payload.idx).forEach(v => {
      v.handler(payload.values, moment(payload.timestamp));
    });
  });
}

export const addSensorListener = (idx, handler) => {
  sensorListeners.push({
    idx,
    handler
  });
}

export const removeSensorListener = (idx, handler) => {
  sensorListeners.splice(sensorListeners.findIndex(v => v.idx === idx && v.handler === handler), 1);
}

export const addBandwidthListener = (handler) => {
  comms.bandwidthListen(handler);
}