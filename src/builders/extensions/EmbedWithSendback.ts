import { Embed } from '../Embed'

export type EmbedSendbackHandler<R extends any, O extends any[]> = (
  builder: Embed,
  ...options: O
) => R

export class EmbedWithSendback<
  R extends any,
  O extends any[] = undefined[]
> extends Embed {
  constructor(private handler: EmbedSendbackHandler<R, O>) {
    super()
  }

  public send(...o: O): R {
    return this.handler(this, ...o)
  }
}
