import { signature, link as linkClass } from './Signature.scss';

class Signature {
  constructor() {
    const link = document.createElement('a');
    link.appendChild(document.createTextNode('Beaglefoot'));
    link.setAttribute('href', 'https://github.com/Beaglefoot');
    link.classList.add(linkClass);

    this.signature = document.createElement('div');
    this.signature.appendChild(document.createTextNode('by '));
    this.signature.appendChild(link);
    this.signature.classList.add(signature);
  }

  appendToDocument() {
    document.body.appendChild(this.signature);
  }

  removeFromDocument() {
    document.body.removeChild(this.signature);
  }

  addClass(className) {
    this.signature.classList.add(className);
  }
}

export default Signature;
