export const find = (querySnapshot) => {
  let datas = []
  querySnapshot.forEach(doc => {
    const data = doc.data()
    data.id = doc.id
    datas.push(data)
  })
  return datas
}

export const findOne = (querySnapshot) => {
  let data = {}
  querySnapshot.forEach(doc => {
    data = doc.data()
    data.id = doc.id
  })
  return data
}

export const getRating = (entity) => {
  if (entity.ratings && Object.keys(entity.ratings).length) {
    let ratings = Object.values(entity.ratings)
    let rate = ratings.reduce((a, b) => a + b) / ratings.length
    return Object.assign({}, entity, { rateCount: ratings.length, rate })
  } else {
    return Object.assign({}, entity, { rateCount: 0, rate: 0 })
  }
}

export const fullNameFormat = (first_name, last_name) => {
  const name1 = first_name.charAt(0).toUpperCase() + first_name.slice(1)
  return `${name1} ${last_name.charAt(0).toUpperCase()}`
}

export const getMyLikedBy = (entity) => {
  if (entity.length === 1) {
    return `<b>${fullNameFormat(entity[0].first_name, entity[0].last_name)}.</b> passed puffs.`
  } else if (entity.length === 2) {
    let name1 = fullNameFormat(entity[0].first_name, entity[0].last_name)
    let name2 = fullNameFormat(entity[1].first_name, entity[1].last_name)
    return `<b>${name1}.</b> and <b>${name2}.</b> passed puffs.`
  } else if (entity.length === 3) {
    let name1 = fullNameFormat(entity[0].first_name, entity[0].last_name)
    let name2 = fullNameFormat(entity[1].first_name, entity[1].last_name)
    return `<b>${name1}.</b> and <b>${name2}.</b> and <b>${entity.length - 2} Other</b> passed puffs.`
  } else if (entity.length > 3) {
    let name1 = fullNameFormat(entity[0].first_name, entity[0].last_name)
    let name2 = fullNameFormat(entity[1].first_name, entity[1].last_name)
    return `<b>${name1}.</b> and <b>${name2}.</b> and <b>${entity.length - 2} Others</b> passed puffs.`
  }
}