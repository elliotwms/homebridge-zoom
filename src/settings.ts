/**
 * This is the name of the platform that users will use to register the plugin in the Homebridge config.json
 */
export const PLATFORM_NAME = 'Zoom';

/**
 * This is the default port the webhook endpoint will listen on
 */
export const DEFAULT_HTTP_PORT = 9666;

export interface Config {
  name: string;
  port: number;
  token: string;
}