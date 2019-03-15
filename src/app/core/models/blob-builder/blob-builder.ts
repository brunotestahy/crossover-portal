export class BlobBuilder {
  private parts = [] as string[];
  private blob = {
    contentType: null as string | null,
    data: null as Blob | null,
  };

  public append(data: string): BlobBuilder {
    this.parts.push(data);
    this.blob.data = null;
    return this;
  }

  public clear(): BlobBuilder {
    this.parts = [];
    this.blob.data = null;
    this.blob.contentType = null;
    return this;
  }

  public get(contentType: string): Blob {
    /* istanbul ignore else */
    if (this.blob.data === null || this.blob.contentType !== contentType) {
      this.blob.contentType = contentType;
      this.blob.data = new Blob(this.parts, {type: this.blob.contentType});
    }
    return this.blob.data;
  }

}
