const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template.trim();
  return newElement.firstChild;
};

export {createElement};
