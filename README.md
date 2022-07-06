# @jadl/builders

Builders library for JaDL

# Base Builders

## Embed

Embed allows the creation of a normal Discord embed object through a builder

Create an embed

```ts
import { Embed } from '@jadl/builders'

const embed = new Embed()
  .title('Hello world!')
  .description('I am here')
  .footer('Woah')
```

You can then render the embed to a Discord API embed object

```ts
embed.render() // APIEmbed
```

## FileBuilder

FileBuilder allows the appension of files to a MessageBuilder or through the parser

```ts
import { FileBuilder } from '@jadl/builders'

const attachments = new FileBuilder()
  .add('hello.txt', Buffer.from('Hi'))
  .add('image.png', imageBuffer)
```

You can then render the FIleBuilder as a form-data object ready to be sent to Discord or through parser

```ts
attachments.toFormData()
```

## MessageBuilder

MessageBuilder allows the appension of the builders and other useful objects to be sent through the parser

```ts
import { MessageBuilder } from '@jadl/builders'

const message = new MessageBuilder({ content: 'Hello world' })
  .addEmbed(embed)
  .addFiles(attachments)
  .addComponentRow({
    type: ComponentType.Button,
    custom_id: 'Hello',
    style: ButtonStyle.Primary,
    label: 'Hello World'
  })
```

You can then render these MessageBuilder's into form-data or a JSON body filled with the data added

```ts
message.render() // form-data or JSON body
```

# Parser

## `parse(input)`

`parse()` turns any readable type & the builders in this package into a valid @discordjs/rest RequestData object to be passed directly to the request. It uses the `parseMessage()` method (below) to create the type, but then adds all of the extra properties and headers necesarry for the request.

```ts
worker // instantiated worker with @discordjs/rest REST on .api

import { parse, MessageTypes } from '@jadl/builders'

function sendMessage (channelId: string, input: MessageTypes) {
  worker.api.post(`/channels/${channelId}/messages`, parse(input))
}
// example list of what you can pass into parse below
```

## `parseMessage()`

`parseMessage()` turns any readable type & the builders in this package into a valid message JSON or form-data. It can take many types like strings, our builders like Embeds and FileBuilders, and of course MessageBuilders, and tries it's best to configure it into a message ready to be sent

> :warning: It is recommended to use `parse()` as not doing so might lack the necesarry headers and configuration to send it as an actual message

```ts
import { parseMessage } from '@jadl/builders'

// works on stringified types such as strings, bigints, numbers & symbols
parseMessage('hello world') => { content: 'hello world' }

// works on our builders
parseMessage(
  new Embed()
    .title('hello world')
) => { embeds: [ { title: 'hello world' } ] }
// anything with files involved will return a form-data
parseMessage(
  new FileBuilder()
    .add('hello.txt', Buffer.from('hi'))
) => FormData<[ ['hello.txt', Buffer<68 69>] ]>

// and of course, on MessageBuilders
parseMessage(
  new MessageBuilder({ content: 'hello' })
    .addEmbeds(
      new Embed()
        .title('goodbye')
    )
    .addComponentRow({
      ...
    })
) => { content: 'hello', embeds: [ { title: 'goobye' }], components: [ ... ] }

// as afforementied, when a file is involed MessageBuilders will also turn into form-data
parseMessage(
  new MessageBuilder({ content: 'hi' })
    .addFiles(
      new FileBuilder()
        .add('hi.txt', Buffer.from('hi'))
    )
) => FormData<[ ['hi.txt', Buffer<68 69>], [ 'payload_json', '{"content": "hi"}' ] ]>
                                           // json payloads are attached correctly for Discord uploading
```