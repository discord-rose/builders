import { MessageBuilder } from '../MessageBuilder'

export type SendbackHandler<R extends any, O extends any[]> = (
  builder: MessageBuilder,
  ...options: O
) => R

export class MessageBuilderWithSendback<
  R extends any,
  O extends any[] = undefined[]
> extends MessageBuilder {
  constructor(private handler: SendbackHandler<R, O>) {
    super()
  }

  public send(...o: O): R {
    return this.handler(this, ...o)
  }
}
