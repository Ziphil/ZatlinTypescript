//


export class ZatlinError extends Error {

  public name: string = "ZatlinError";
  public code: number;

  public constructor(code: number, shortMessage: string) {
    super(ZatlinError.createMessage(code, shortMessage));
    this.code = code;
  }

  private static createMessage(code: number, shortMessage: string): string {
    let message = `${code} | ${shortMessage}`;
    return message;
  }

}