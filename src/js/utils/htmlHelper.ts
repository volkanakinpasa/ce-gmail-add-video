const createImage = ({
  src,
  id,
  className,
  cssText = 'max-width: 225px; height: auto;',
}: {
  src: string;
  id?: string;
  className?: string;
  cssText?: string;
}): HTMLImageElement => {
  const element: HTMLImageElement = document.createElement('img');
  element.src = src;
  element.id = id;
  element.className = className;
  element.style.cssText = cssText;
  return element;
};

const createSpan = ({
  id,
  className,
  cssText,
}: {
  id?: string;
  className?: string;
  cssText?: string;
}): HTMLSpanElement => {
  const element: HTMLSpanElement = document.createElement('span');
  element.id = id;
  element.className = className;
  element.style.cssText = cssText;
  return element;
};

export { createImage, createSpan };
