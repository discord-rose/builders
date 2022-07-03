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

balls
