export function debounce(callback, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function fakeAPIRequst() {
  const fakeData = "fake data";
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeData);
    }, 2000);
  });
}
