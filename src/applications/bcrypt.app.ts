import bcrypt from 'bcrypt';
export class BcryptApp {
  async hushGenerate(password: string): Promise<string> {
    const hush: string = await bcrypt.hash(password, 10);

    return hush;
  }

  public async hushCompare(password: string, hush: string): Promise<boolean> {
    const hushValid: boolean = await bcrypt.compare(password, hush);

    return hushValid;
  }
}
