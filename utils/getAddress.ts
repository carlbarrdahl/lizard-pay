export function getAddress(str: string | null) {
  return str ? (str.match(/0x[a-fA-F0-9]{40}/) || [])[0] : "";
}
