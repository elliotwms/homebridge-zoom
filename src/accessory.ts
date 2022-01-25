import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service,
} from 'homebridge';
import {Server} from './server';
import {DEFAULT_HTTP_PORT, Config} from './settings';

let hap: HAP;

export class ZoomMeetingSwitch implements AccessoryPlugin {

  private readonly log: Logging;
  private readonly name: string;
  private switchOn = false;
  private server: Server;
  private readonly config: Config;

  private readonly switchService: Service;
  private readonly informationService: Service;

  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.log = log;
    this.name = config.name;
    this.config = {
      name: config.name ?? 'Zoom',
      port: config.port as number ?? DEFAULT_HTTP_PORT,
      token: config.token as string,
      userIDs: config.userIDs as string[],
    };

    hap = api.hap;

    this.switchService = new hap.Service.Switch(this.name);
    this.switchService.getCharacteristic(hap.Characteristic.On)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.debug('Current state of the switch was returned: ' + (this.switchOn ? 'ON' : 'OFF'));
        callback(undefined, this.switchOn);
      })
      .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        this.switchOn = value as boolean;
        log.debug('Switch state was set to: ' + (this.switchOn ? 'ON' : 'OFF'));
        callback();
      });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'Custom Manufacturer')
      .setCharacteristic(hap.Characteristic.Model, 'Custom Model');

    this.server = new Server(this.config.port, this.config.token, this.config.userIDs, log, (active: boolean): void => {
      this.log.debug('Setting status to active: ' + active);
      this.switchService.updateCharacteristic(hap.Characteristic.On, active);
    });

    if (!this.config.token) {
      this.log.error('missing token');
    }

    this.server.serve();
  }

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */
  identify(): void {
    this.log.info('Identify!');
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [
      this.informationService,
      this.switchService,
    ];
  }
}