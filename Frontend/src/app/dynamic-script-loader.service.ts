import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadScript(scriptUrl: string): void {
    if (!this.isScriptLoaded(scriptUrl)) {
      const body = this.renderer.selectRootElement('body', true);
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'type', 'text/javascript');
      this.renderer.setAttribute(script, 'src', scriptUrl);
      this.renderer.appendChild(body, script);
    }
  }

  removeScript(scriptUrl: string): void {
    const body = this.renderer.selectRootElement('body', true);
    const existingScriptElement = body.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScriptElement) {
      this.renderer.removeChild(body, existingScriptElement);
    }
  }

  private isScriptLoaded(scriptUrl: string): boolean {
    const body = this.renderer.selectRootElement('body', true);
    return !!body.querySelector(`script[src="${scriptUrl}"]`);
  }
}
