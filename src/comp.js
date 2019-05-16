import { h, render, unmountComponentAtNode } from 'preact';
import { App } from './App';

/** @jsx h */
class AppComp extends HTMLElement {
  constructor() {
    super();
    this.observer = new MutationObserver(() => this.update());
    this.observer.observe(this, { attributes: true });
  }
  connectedCallback() {
    this.mount();
  }
  disconnectedCallback() {
    this.unmount();
    this.observer.disconnect();
  }
  update() {
    this.unmount();
    this.mount();
  }
  mount() {
    const props = {
      ...this.getProps(this.attributes, App.propTypes),
      ...this.getEvents(App.propTypes)
    };
    render(<App {...props} />, this);
  }
  unmount() {
    unmountComponentAtNode(this);
  }
  getEvents(propTypes) {
    return Object.keys(propTypes)
      .filter(key => /on([A-Z].*)/.exec(key))
      .reduce(
        (events, ev) => ({
          ...events,
          [ev]: args => this.dispatchEvent(new CustomEvent(ev, { ...args }))
        }),
        {}
      );
  }
  getProps(attributes, propTypes) {
    propTypes = propTypes || {};
    return [...attributes]
      .filter(attr => attr.name !== 'style')
      .map(attr => this.convert(propTypes, attr.name, attr.value))
      .reduce((props, prop) => ({ ...props, [prop.name]: prop.value }), {});
  }
  convert(propTypes, attrName, attrValue) {
    const propName = Object.keys(propTypes).find(
      key => key.toLowerCase() == attrName
    );
    let value = attrValue;
    if (attrValue === 'true' || attrValue === 'false')
      value = attrValue == 'true';
    else if (!isNaN(attrValue) && attrValue !== '') value = +attrValue;
    else if (/^{.*}/.exec(attrValue)) value = JSON.parse(attrValue);
    return {
      name: propName ? propName : attrName,
      value: value
    };
  }
}

customElements.define('app-comp', AppComp);
