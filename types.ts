
export interface AdSurface {
  id: string;
  name: string;
  emoji: string;
  imageUrl: string;
  promptHint: string;
}

export interface GeneratedImage {
  surfaceName: string;
  imageUrl: string;
}
