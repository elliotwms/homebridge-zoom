import {Logging} from 'homebridge';
import express, {Express, Request, Response} from 'express';
import {PresenceStatus, PresenceStatusUpdated} from './events/user.presence_status_updated.event';

// activeStatuses reflect presence statuses which indicate the user is active on Zoom
// https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/presence-status-updated
const activeStatuses = ['In_Meeting', 'Presenting', 'On_Phone_Call'];

export class Server {
  private readonly log: Logging;
  private readonly app: Express;
  private readonly port: number;
  private readonly token: string;

  // lastStatus reflects the last status received by the webhook
  private lastStatus = '';

  constructor(port: number, token: string, log: Logging, onUpdate: (bool) => void) {
    this.log = log;
    this.port = port;
    this.token = token;

    this.app = express()
      .use(express.json())
      .get('/', (req: Request, res: Response) => {
        this.log('GET: ' + req.url);
        res.send('homebridge-zoom is running');
      })
      .post('/', this.handler(onUpdate));
  }

  private handler(onUpdate: (bool) => void) {
    return (req: Request, res: Response) => {
      if (req.headers.authorization !== this.token) {
        res.sendStatus(401);
        return;
      }

      const body = req.body as PresenceStatusUpdated;

      if (!body.payload?.object?.presence_status) {
        res.sendStatus(400);
        return;
      }

      res.sendStatus(200);

      this.log('Received user presence: ' + body.payload.object.presence_status);

      this.checkStatus(body.payload.object.presence_status, onUpdate);
    };
  }

  serve(): void {
    this.app.listen(this.port, () => {
      this.log.debug('Listening on port ' + this.port);
    });
  }

  // checkStatus checks whether the status received should notify the callback in the event of a change in activity
  checkStatus(status: PresenceStatus, onUpdate: (state: boolean) => void): void {
    const
      isActive = activeStatuses.includes(status),
      wasActive = activeStatuses.includes(this.lastStatus);

    // call onUpdate if the last status is unknown, or if the activity has changed
    if (this.lastStatus === '' || isActive !== wasActive) {
      onUpdate(isActive);
      this.lastStatus = status;
    }
  }
}
