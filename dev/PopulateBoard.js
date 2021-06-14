export const populateEmulator = (user) => async () => {
  const randomNumber = () => Math.round(Math.random() * 3)

  const firstBoard = await FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .close()
    .add({
      createdAt: new Date("January 1, 2021 09:00:00"),
      title: `Mood`,
      symbols: [
        { emoji: `😔`, color: colorOptions[0] },
        { emoji: `😘`, color: colorOptions[1] },
      ],
      binary: false,
    })
    .then((createdDoc) => createdDoc.id)
  await FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .append(`selected`)
    .close()
    .set({ selected: firstBoard })
  const firstBoardStub = FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .append(firstBoard)
    .append(`data`)

  const docs = []

  for (let i = 1; i <= 31; i++) {
    if (Math.random() > 0.3)
      docs.push(
        firstBoardStub
          .append(`2021`)
          .append(`01`)
          .append(String(i).padStart(2, `0`))
          .close()
          .set({
            createdAt: new Date(`January ${i}, 2021 9:00:00`),
            "😔": randomNumber(),
            "😘": randomNumber(),
          })
      )
  }

  for (let i = 1; i <= 28; i++) {
    if (Math.random() > 0.3)
      docs.push(
        firstBoardStub
          .append(`2021`)
          .append(`02`)
          .append(String(i).padStart(2, `0`))
          .close()
          .set({
            createdAt: new Date(`February ${i}, 2021 9:00:00`),
            "😔": randomNumber(),
            "😘": randomNumber(),
          })
      )
  }

  const secondBoard = await FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .close()
    .add({
      createdAt: new Date("January 1, 2021 09:00:00"),
      title: `Ecks dee`,
      symbols: [{ emoji: `🚶‍♀️`, color: colorOptions[0] }],
      binary: true,
    })
    .then((createdDoc) => createdDoc.id)

  const secondBoardStub = FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .append(secondBoard)
    .append(`data`)

  for (let i = 1; i <= 31; i++) {
    if (Math.random() > 0.2)
      docs.push(
        secondBoardStub
          .append(`2021`)
          .append(`01`)
          .append(String(i).padStart(2, `0`))
          .close()
          .set({
            createdAt: new Date(`January ${i}, 2021 9:00:00`),
            "🚶‍♀️": 1,
          })
      )
  }

  for (let i = 1; i <= 28; i++) {
    if (Math.random() > 0.2)
      docs.push(
        secondBoardStub
          .append(`2021`)
          .append(`02`)
          .append(String(i).padStart(2, `0`))
          .close()
          .set({
            createdAt: new Date(`February ${i}, 2021 9:01:00`),
            "🚶‍♀️": 1,
          })
      )
  }

  for (let i = 1; i <= 27; i++) {
    if (Math.random() > 0.2)
      docs.push(
        secondBoardStub
          .append(`2021`)
          .append(`03`)
          .append(String(i).padStart(2, `0`))
          .close()
          .set({
            createdAt: new Date(`March ${i}, 2021 9:01:00`),
            "🚶‍♀️": 1,
          })
      )
  }

  await Promise.all(docs)
}
