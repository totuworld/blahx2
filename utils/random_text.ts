export function get8RandomText(): string {
  function get4RandomText() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${get4RandomText()}${get4RandomText()}`;
}
