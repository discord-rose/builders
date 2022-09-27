import type { APIEmbed } from 'discord-api-types/v9'
import Colors from '../utils/colors'

/**
 * Discord Embed
 */
export class Embed {
  static default = new Embed({})

  constructor(public obj: APIEmbed = Embed.default.clone().render()) {}

  /**
   * Sets the color
   * @param color Color hex code
   */
  color(color: keyof typeof Colors | number): this {
    this.obj.color = Colors[color] ?? color

    return this
  }

  /**
   * Sets author
   * @param name Name of author
   * @param icon Author avatar icon
   * @param url URL anchored to the author name
   */
  author(name: string, icon?: string, url?: string): this {
    this.obj.author = {
      name,
      icon_url: icon,
      url
    }

    return this
  }

  /**
   * Sets the title
   * @param title Title name
   * @param url URL anchored to title name
   */
  title(title?: string, url?: string): this {
    if (title) this.obj.title = title
    if (url) this.obj.url = url

    return this
  }

  /**
   * Sets description
   * @param desc Description
   */
  description(desc: string): this {
    this.obj.description = desc

    return this
  }

  /**
   * Adds a field
   * @param name Fields title
   * @param value Fields value
   * @param inline Whether the field is inline
   */
  field(name: string, value: string, inline?: boolean): this {
    if (!this.obj.fields) this.obj.fields = []
    this.obj.fields.push({
      name,
      value,
      inline
    })

    return this
  }

  /**
   * Sets the thumbnail
   * @param url URL of thumbnail
   * @param width Optional fixed width
   * @param height Optional fixed height
   */
  thumbnail(url: string, width?: number, height?: number): this {
    this.obj.thumbnail = {
      url,
      width,
      height
    }

    return this
  }

  /**
   * Sets the image
   * @param url URL of image
   * @param width Optional fixed width
   * @param height Optional fixed height
   */
  image(url: string, width?: number, height?: number): this {
    this.obj.image = {
      url,
      width,
      height
    }

    return this
  }

  /**
   * Sets the video
   * @param url URL of video
   * @param width Optional fixed width
   * @param height Optional fixed height
   */
  video(url: string, width?: number, height?: number): this {
    this.obj.video = {
      url,
      width,
      height
    }

    return this
  }

  /**
   * Sets the footer
   * @param text Text for footer
   * @param icon Small icon on the bottom left
   */
  footer(text?: string, icon?: string): this {
    if (!this.obj.footer) this.obj.footer = { text: '' }
    if (text) this.obj.footer.text = text
    if (icon) this.obj.footer.icon_url = icon

    return this
  }

  /**
   * Sets the timestamp
   * @param date Date to set, leave blank for current time
   */
  timestamp(date: Date = new Date()): this {
    this.obj.timestamp = date.toISOString()

    return this
  }

  clone() {
    return new Embed(JSON.parse(JSON.stringify(this.obj)))
  }

  static LIMITS = {
    TITLE_LENGTH: 256,
    DESCRIPTION_LENGTH: 4096,
    FIELD_NAME_LENGTH: 256,
    FIELD_VALUE_LENGTH: 1024,
    FOOTER_TEXT_LENGTH: 2048,
    AUTHOR_NAME_LENGTH: 256,
    TOTAL_LENGTH: 6000,
    FIELDS: 25
  }

  /**
   * Total length of the embed of combined character elements (should not exceed 6000)
   */
  get length() {
    return (
      (this.obj.title?.length || 0) +
      (this.obj.description?.length || 0) +
      (this.obj.fields?.reduce(
        (a, b) => a + b.name.length + b.value.length,
        0
      ) || 0) +
      (this.obj.footer?.text?.length || 0) +
      (this.obj.author?.name?.length || 0)
    )
  }

  /**
   * Tests the embeds values for exceeded limits
   * @returns Whether or not a part of the embed exceeds it's limits
   */
  exceedsLimits() {
    return (
      this.length > Embed.LIMITS.TOTAL_LENGTH ||
      (this.obj.title?.length || 0) > Embed.LIMITS.TITLE_LENGTH ||
      (this.obj.description?.length || 0) > Embed.LIMITS.DESCRIPTION_LENGTH ||
      (this.obj.fields?.length || 0) > Embed.LIMITS.FIELDS ||
      this.obj.fields?.some(
        (field) =>
          field.name.length > Embed.LIMITS.FIELD_NAME_LENGTH ||
          field.value.length > Embed.LIMITS.FIELD_VALUE_LENGTH
      ) ||
      (this.obj.footer?.text?.length || 0) > Embed.LIMITS.FOOTER_TEXT_LENGTH ||
      (this.obj.author?.name?.length || 0) > Embed.LIMITS.AUTHOR_NAME_LENGTH
    )
  }

  /**
   * Renders the embed
   * @returns
   */
  render(): APIEmbed {
    return this.obj
  }
}
