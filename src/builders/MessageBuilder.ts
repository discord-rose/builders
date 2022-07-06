import { APIEmbed, APIMessageActionRowComponent } from 'discord-api-types/v9'
import {
  APIInteractionResponseCallbackData,
  ComponentType
} from 'discord-api-types/v9'
import { Embed } from './Embed'
import { FileBuilder } from './FileBuilder'

export class MessageBuilder {
  files?: FileBuilder

  constructor(public message: APIInteractionResponseCallbackData = {}) {}

  setMessage(msg: this['message']): this {
    this.message = msg

    return this
  }

  addEmbed(...embedOrEmbeds: Array<APIEmbed[] | Embed[] | APIEmbed | Embed>) {
    const embeds = embedOrEmbeds
      .flat()
      .map((x) => (x instanceof Embed ? x.render() : x))

    this.message.embeds = embeds
  }

  addFiles(files: FileBuilder) {
    if (!this.files) this.files = files.clone()
    else {
      files
        .clone()
        .files.forEach((file) => this.files!.add(file.name, file.buffer))
    }
  }

  addComponentRow(
    ...componentOrComponents: Array<
      APIMessageActionRowComponent | APIMessageActionRowComponent[]
    >
  ): this {
    if (!this.message.components) this.message.components = []

    this.message.components.push({
      type: ComponentType.ActionRow,
      components: componentOrComponents.flat()
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
