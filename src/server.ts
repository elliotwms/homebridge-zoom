import {Logging} from 'homebridge';
import express, {Express, Request, Response} from 'express';
import {DEFAULT_HTTP_PORT} from './settings';

// activeStatuses reflect presence statuses which indicate the user is active on Zoom
// https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/presence-status-updated
const activeStatuses = ['In_Meeting', 'Presenting', 'On_Phone_Call'];

export class Server {
  private readonly log: Logging;
  private readonly app: Express;
  private readonly port: number;

  // lastStatus reflects the last status received by the webhook
  private lastStatus = '';

  constructor(port: number, log: Logging, onUpdate: (bool) => void) {
    this.log = log;
    this.port = port ?? DEFAULT_HTTP_PORT;

    this.app = express()
      .use(express.json())
      .post('/', (req: Request, res: Response) => {
        this.log(req.body);

        this.log('Received user presence: ' + req.body.payload.object.presence_status);
        res.send();

        this.checkStatus(req.body.payload.object.presence_status, onUpdate);
      });
  }

  serve(): void {
    this.app.listen(this.port, () => {
      this.log.debug('Listening on port ' + this.port);
    });
  }

  // checkStatus checks whether the status received should notify the callback in the event of a change in activity
  checkStatus(status: string, onUpdate: (state: boolean) => void): void {
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
