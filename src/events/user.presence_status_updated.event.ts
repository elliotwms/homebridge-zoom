/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Presence status. The value can be one of these: `Available`, `Away`, `Do_Not_Disturb`, `In_Meeting`, `Presenting`, `On_Phone_Call` and `In_Calendar_Event`.
 */
export type PresenceStatus =
  | "Available"
  | "Away"
  | "Do_Not_Disturb"
  | "In_Meeting"
  | "Presenting"
  | "On_Phone_Call"
  | "In_Calendar_Event";

export interface PresenceStatusUpdated {
  /**
   * Name of the event.
   */
  event?: string;
  /**
   * Timestamp (in milliseconds since epcoch) at which the event occured. The value of this field is returned in long(int64) format.
   */
  event_ts?: number;
  payload?: {
    /**
     * The Account ID of the user.
     */
    account_id?: string;
    object?: {
      /**
       * The date and time at which the user signed in.
       */
      date_time?: string;
      /**
       * Email address of the user whose presence status was updated.
       */
      email?: string;
      /**
       * User ID of the user whose presence status was updated.
       */
      id?: string;
      presence_status?: PresenceStatus;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  [k: string]: unknown;
}