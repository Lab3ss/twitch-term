const getUserInfos = async (axiosInstance, userLogin) => {
  try {
    const res = await axiosInstance.get(`/users?login=${userLogin}`)
    if (!res.data || !res.data.data || res.data.data.length === 0) {
      throw res.error
    }
    return {
      id: res.data.data[0].id,
      name: res.data.data[0].display_name,
      description: res.data.data[0].description
    }
  } catch (e) {
    console.error('Error fetching user infos : ', e)
    process.exit(2)
  }
}

const getChannelInfos = async (axiosInstance, userId) => {
  try {
    const res = await axiosInstance.get(`/channels?broadcaster_id=${userId}`)
    if (!res.data || !res.data.data || res.data.data.length === 0) {
      throw res.error
    }
    return {
      category: res.data.data[0].game_name,
      title: res.data.data[0].title,
    }
  } catch (e) {
    console.error('Error fetching channel infos : ', e)
    process.exit(3)
  }
}

const getLastFollower = async (axiosInstance, userId) => {
  try {
      const res = await axiosInstance.get(`/users/follows?to_id=${userId}&first=1`)
      if (!res.data || !res.data.data || res.data.data.length === 0) {
        throw res.error
      }
    return ({ total: res.data.total, last: res.data.data[0]})
  } catch (e) {
    console.error('Error fetching last follower : ', e)
    process.exit(4)
  }
}
/*
const getUserFollowers = async (axiosInstance, userId) => {
  try {
    const res = await axiosInstance.get(`/users/follows?to_id=${userId}&first=20`)
    if (!res.data || !res.data.data || res.data.data.length === 0) {
      throw res.error
    }
    console.log(res.data)
  } catch (e) {
    console.error('Error fetching user followers : ', e)
    process.exit(4)
  }
}
*/
module.exports = { getUserInfos, getChannelInfos, getLastFollower }
