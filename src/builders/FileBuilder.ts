import FormData from 'form-data'

export interface FileBuilderFile {
  name: string
  buffer: Buffer
}

/**
 * File builder for easily sending file(s) as a response
 * @example
 * return new FileBuilder()
 *   .add('image.png', imageBuffer)
 *   .add('info.txt', Buffer.from('What\'s up!'))
 */
export class FileBuilder {
  constructor(public files: FileBuilderFile[] = []) {}

  /**
   * Adds a file to be sent
   * @param name Name of file
   * @param buffer Buffer of the file
   * @returns {FileBuilder}
   */
  add(name: string, buffer: Buffer): this {
    this.files.push({ name, buffer })

    return this
  }

  /**
   * Removes a file from the builder
   * @param name Name of file
   * @returns {FileBuilder}
   */
  remove(name: string): this {
    this.files = this.files.filter((x) => x.name !== name)

    return this
  }

  /**
   * Finds a file by it's name
   * @param name Name of file
   * @returns {FileBuilderFile}
   */
  find(name: string): FileBuilderFile | undefined {
    return this.files.find((x) => x.name === name)
  }

  /**
   * Clones this file builder to a deep cloned new FileBuilder
   * @returns {FileBuilder} cloned FileBuilder
   */
  clone(): FileBuilder {
    return new FileBuilder(
      this.files.map((x) => ({
        name: x.name,
        buffer: Buffer.from(x.buffer)
      }))
    )
  }

  /**
   * Renders the FileBuilder to form-data
   * @returns {FormData}
   */
  toFormData(): FormData {
    const form = new FormData()
    if (this.files.length < 2) {
      form.append('file', this.files[0].buffer, this.files[0].name)
    } else {
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i]
        form.append(`file${i}`, file.buffer, file.name)
      }
    }

    return form
  }
}
