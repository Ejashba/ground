class Comms {
  constructor() {
    this.ipc = null;
  }
  
  /**
   * The IPC object allows the renderer process
   * (this one) to talk to the main process. This is
   * important, because only the main process can
   * access hardware like serial ports and the file
   * system.
   * @param {EventEmitter} ipc the ipc instance used to communicate with main process
   */
  init = ipc => {
    this.ipc = ipc; // ipc instance used to communicate with main process
  }

  /**
   * @return {Array} a list of ports by name
   */
  listPorts = async () => {
    return await this.ipc.invoke('list-ports');
  }

  /**
   * @param {Object} port port object
   * @param {Number} baud the baud rate for the port (should be 57600 for Radio)
   */
  selectPort = async (port, baud) => {
    return await this.ipc.invoke('select-port', port, baud);
  }

  getConnected = async () => {
    return await this.ipc.invoke('get-connected');
  }

  getPort = async () => {
    return await this.ipc.invoke('get-port');
  }

  /**
   * @param {function} handle function to call when connection status changes
   */
  connListen = handle => {
    this.ipc.on('connect', (event) => {
      handle(true);
    });
    this.ipc.on('disconnect', (event) => {
      handle(false);
    });
  }

  sensorListen = handle => {
    this.ipc.on('sensor-data', (event, payload) => {
      handle(payload);
    });
  }

  bandwidthListen = handle => {
    this.ipc.on('bandwidth', (event, payload) => {
      handle(payload);
    });
  }
}

const instance = new Comms();

export default instance;
