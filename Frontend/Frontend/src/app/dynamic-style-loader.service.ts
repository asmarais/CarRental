import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicStyleLoaderService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadStyle(styleUrl: string): void {
    if (!this.isStyleLoaded(styleUrl)) {
      const head = this.renderer.selectRootElement('head', true);
      const styleElement = this.renderer.createElement('link');
      this.renderer.setAttribute(styleElement, 'rel', 'stylesheet');
      this.renderer.setAttribute(styleElement, 'href', styleUrl);
      this.renderer.appendChild(head, styleElement);
    }
  }

  removeStyle(styleUrl: string): void {
    const head = this.renderer.selectRootElement('head', true);
    const existingLinkElement = head.querySelector(`link[href="${styleUrl}"]`);
    if (existingLinkElement) {
      this.renderer.removeChild(head, existingLinkElement);
    }
  }

  private isStyleLoaded(styleUrl: string): boolean {
    const head = this.renderer.selectRootElement('head', true);
    return !!head.querySelector(`link[href="${styleUrl}"]`);
  }
}
