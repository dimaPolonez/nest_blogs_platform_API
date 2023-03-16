import { v4 } from 'uuid';
import { add } from 'date-fns';

export class ActiveCodeApp {
  public async createCode() {
    const authParams = {
      codeActivated: v4(),
      lifeTimeCode: await this.createTime(),
      confirm: false,
    };

    return authParams;
  }

  private async createTime(): Promise<string> {
    const lifetime: string = add(new Date(), {
      hours: 1,
      minutes: 10,
    }).toString();

    return lifetime;
  }
}
