const { shell } = window.require('electron');

const num = (value, params = {}) => {
  let v = parseFloat(value);
  const sym = (params.noSymbol) ? '' : (v >= 0 ? '+' : '-');
  if (!isNaN(v)) return `${sym}${params.before ? params.before : ''}${Math.abs(v).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${params.after ? params.after : ''}`;
}

const link = (url) => {
  shell.openExternal(url);
}

const notify = (title, body, icon) => {
  new Notification(title, { body, icon});
}


export { num, link, notify }
