import { endOfMonth, isBefore, subMonths } from "date-fns"

export const createDateString = (date) => {
  const padStart = (n) => String(n).padStart(2, `0`)
  return `${date.getFullYear()}/${padStart(date.getMonth() + 1)}/${padStart(
    date.getDate()
  )}`
}

export const getMonthBefore = ({ date }) => {
  const monthBefore = subMonths(date, 1)
  const string = createDateString(monthBefore).slice(0, 7)
  return {
    date: monthBefore,
    year: string.slice(0, 4),
    month: string.slice(5, 7),
  }
}

export const isEndOfMonthBeforeCreatedAt = ({ date, createdAt }) => {
  const monthEnd = endOfMonth(date)
  const createdAtAsDate = new Date(createdAt.seconds * 1000)
  return isBefore(monthEnd, createdAtAsDate)
}

export const stripCreatedAt = ({ createdAt, ...props }) =>
  Object.keys(props).length
    ? {
        ...props,
      }
    : null

// export const emojiRegex = new RegExp(
//   /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
// )

export const emojiRegex = new RegExp(
  /(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\u200d|\ufe0f)/,
  `gu`
)

const isModifier = (string) =>
  string.match(/\u200D/u)
    ? `ZWJ`
    : string.match(
        new RegExp(/(\p{Emoji_Modifier})|(\p{Emoji_Component})/, `gu`)
      )

export const reduceEmojiModifiers = (matches) => {
  let array = []
  let chars = []

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i]
    const next = matches[i + 1]

    chars.push(current)

    if (next && !isModifier(next)) {
      if (isModifier(current) !== `ZWJ`) {
        array.push(chars.join(``))
        chars = []
      }
    } else if (!next) {
      array.push(chars.join(``))
    }
  }
  return array
}

export const emojiFromSymbolsArray = (symbols) =>
  symbols.reduce((acc, { emoji }) => [...acc, emoji], [])

export const colorsFromSymbolsArray = (symbols) =>
  symbols.reduce((acc, { color }) => [...acc, color], [])

export const emojiColorDict = (symbols) =>
  symbols.reduce((acc, { emoji, color }) => {
    acc[emoji] = color
    return acc
  }, {})

export const splitSymbolsArray = (symbols) =>
  symbols.reduce(
    (acc, curr) => {
      Object.entries(curr).forEach(([key, value]) => {
        const propName = `${key}List`
        acc[propName].push(value)
      })
      return acc
    },
    Object.keys(symbols[0]).reduce((acc, curr) => {
      const propName = `${curr}List`
      acc[propName] = []
      return acc
    }, {})
  )
