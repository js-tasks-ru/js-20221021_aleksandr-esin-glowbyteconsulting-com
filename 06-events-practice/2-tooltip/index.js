class Tooltip {
  static activeTooltip = null;
  
  constructor() {
   if (Tooltip.activeTooltip){
      return Tooltip.activeTooltip
   }
   Tooltip.activeTooltip = this 
  }

  render(html) {
    this.element = document.createElement("div");
    this.element.className = 'tooltip';
    this.element.innerHTML = html;
    document.body.append(this.element);
  }
    
  initialize () {
    document.addEventListener('pointerover', this.onPointerOver);
  }
  
  onPointerOver = (event) => {
    if (event.target.dataset.tooltip){
      this.render(event.target.dataset.tooltip);
      document.addEventListener('pointermove', this.onPinterMove);
      document.addEventListener('pointerout', this.onPointerLeave);
    }
  }

  onPinterMove = (event) =>{
    const bias = 10;
    const left =  event.clientY + bias;
    const right = event.clientX + bias;
    this.element.style.top = left + "px";
    this.element.style.left = right + "px";
  }

  onPointerLeave = () => {
    document.removeEventListener('pointermove', this.onPinterMove);
    this.element.remove();
  }

  remove() {
    document.removeEventListener('pointerover', this.onPointerOver);
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }


}

export default Tooltip;