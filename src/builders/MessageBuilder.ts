import { APIEmbed, APIMessageActionRowComponent } from 'discord-api-types/v9'
import {
  APIInteractionResponseCallbackData,
  ComponentType
} from 'discord-api-types/v9'
import { TypeOrRender } from '../parser'
import { Embed } from './Embed'
import { FileBuilder } from './FileBuilder'

export class MessageBuilder {
  files?: FileBuilder

  constructor(public message: APIInteractionResponseCallbackData = {}) {}

  setMessage(msg: TypeOrRender<this['message']>): this {
    this.message = 'render' in msg ? msg.render() : msg

    return this
  }

  addEmbed(
    ...embedOrEmbeds: Array<TypeOrRender<APIEmbed> | TypeOrRender<APIEmbed>[]>
  ): this {
    const embeds = embedOrEmbeds
      .flat()
      .map((x) => ('render' in x ? x.render() : x))

    this.message.embeds = embeds

    return this
  }

  addFiles(files: FileBuilder): this {
    if (!this.files) this.files = files.clone()
    else {
      files
        .clone()
        .files.forEach((file) => this.files!.add(file.name, file.buffer))
    }

    return this
  }

  addComponentRow(
    ...componentOrComponents: Array<
      | TypeOrRender<APIMessageActionRowComponent>
      | TypeOrRender<APIMessageActionRowComponent>[]
    >
  ): this {
    if (!this.message.components) this.message.components = []

    this.message.components.push({
      type: ComponentType.ActionRow,
      components: componentOrComponents
        .flat()
        .map((x) => ('render' in x ? x.render() : x))
    })

    return this
  }

  render() {
    if (this.files && this.files.files.length) {
      const formData = this.files.toFormData()

      formData.append('payload_json', JSON.stringify(this.message))

      return formData
    } else return this.message
  }
}
