import {Logging} from 'homebridge';
import express, {Express, Request, Response} from 'express';

const port = 9666;

const presentStatuses = ['In_Meeting', 'Presenting'];

export class Server {
  private readonly log: Logging;
  private readonly app: Express;
  private lastStatus = '';

  constructor(log: Logging, onUpdate: (bool) => void) {
    this.log = log;

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
    this.app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log('listening on port ' + port);
    });
  }

  checkStatus(status: string, onUpdate: (state: boolean) => void): void {
    const
      isPresent = presentStatuses.includes(status),
      wasPresent = presentStatuses.includes(this.lastStatus);

    if (this.lastStatus === '' || isPresent !== wasPresent) {
      onUpdate(isPresent);
      this.lastStatus = status;
    }
  }
}
