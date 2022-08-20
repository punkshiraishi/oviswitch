export function validUrl(url: string) {
  const regex = /^(?:https?:\/\/)?(?:[^.]+\.)?ovice\.in(\/.*)?$/

  return regex.test(url)
}
