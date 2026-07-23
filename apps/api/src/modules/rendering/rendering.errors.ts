export class RenderBoundsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = RenderBoundsError.name;
  }
}

export class RenderSourceError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = RenderSourceError.name;
  }
}

export class WatermarkCompositionError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = WatermarkCompositionError.name;
  }
}
