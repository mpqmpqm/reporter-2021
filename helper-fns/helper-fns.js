export const createDateString = (date) => {
  const padStart = (n) => String(n).padStart(2, `0`)
  return `${date.getFullYear()}/${padStart(date.getMonth() + 1)}/${padStart(
    date.getDate()
  )}`
}
