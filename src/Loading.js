class Loading {
  constructor() {
    this.loading = document.createElement('div');
    this.loading.appendChild(document.createTextNode('Loading'));
  }

  appendToNode(node) {
    node.appendChild(this.loading);
  }

  startAnimation() {
    this.intervalId = setInterval(() => {
      if ((this.loading.textContent.match(/\./g) || []).length <= 5) {
        this.loading.textContent += '.';
      }
      else this.loading.textContent = 'Loading';
    }, 200);
  }

  stopAnimation() {
    clearInterval(this.intervalId);
  }

  removeFromNode(node) {
    this.stopAnimation();
    node.removeChild(this.loading);
  }
}

export default Loading;
