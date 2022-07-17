import { Embed } from './builders/Embed'
import { FileBuilder } from './builders/FileBuilder'
import { MessageBuilder } from './builders/MessageBuilder'
import { APIInteractionResponseCallbackData } from 'discord-api-types/v9'
import type { RequestData } from '@discordjs/rest'
import FormData from 'form-data'

export type BuilderTypes = Embed | FileBuilder | MessageBuilder

type StringifiedMessageTypes = string | bigint | number | symbol

export type MessageObjectTypes = APIInteractionResponseCallbackData

export type MessageTypes =
  | BuilderTypes
  | StringifiedMessageTypes
  | MessageObjectTypes

export function resolveString(data: any): string {
  if (typeof data === 'string') return data
  if (Array.isArray(data)) return data.join(', ')

  return String(data)
}

const isStringified = (val: any): val is StringifiedMessageTypes => {
  return [
    'bigint',
    'function',
    'number',
    'string',
    'symbol',
    'undefined'
  ].includes(typeof val)
}

export function parseToMessageBuilder(input: MessageTypes) {
  let messageBuilder =
    input instanceof MessageBuilder ? input : new MessageBuilder()

  if (input instanceof MessageBuilder) {
  } else if (input instanceof Embed) {
    messageBuilder.addEmbed(input)
  } else if (input instanceof FileBuilder) {
    messageBuilder.addFiles(input)
  } else if (isStringified(input)) {
    messageBuilder.setMessage({ content: resolveString(input) })
  } else {
    messageBuilder.setMessage(input)
  }

  return messageBuilder
}

export function parseMessage(input: MessageTypes) {
  return parseToMessageBuilder(input).render()
}

export function parse(input: MessageTypes): RequestData {
  const data = parseMessage(input)

  return {
    body: data instanceof FormData ? data : JSON.stringify(data),
    passThroughBody: true,
    headers:
      data instanceof FormData
        ? data.getHeaders()
        : {
            'Content-Type': 'application/json'
          }
  }
}
