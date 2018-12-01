const index = {
  path: `/index`,
}

const score = {
  path: `/score`,
  post: {
    form: ['score'],
  },
}
const file = {
  path: `/file/:fileId`,
  subs: {
    score,
  },
}

export default {
  index,
  file,
}
