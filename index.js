require('dotenv').config();

const axios = require('axios')
const tmi = require('tmi.js');


const { getUserInfos, getChannelInfos, getLastFollower } = require('./api')
const { displayChat, getUserColor, parseEmote, notif } = require('./terminal')

const CLIENT_ID = process.env.CLIENT_ID
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const USER_LOGIN = process.env.USER_LOGIN

const API = 'https://api.twitch.tv/helix'

if (!CLIENT_ID || !ACCESS_TOKEN || !USER_LOGIN) {
  console.error('Missing auth environment')
  process.exit(1)
}


const user = {}
const channel = {}
const chat = [{ username: 'Lab3ss', message: "C'est parti les amis !", color: 'c'}]
let newSpecs = []

let followersNumber
let displayJoin = false

const ircClient = new tmi.Client({
  options: {
    debug: false,
    clientId: CLIENT_ID,
  },
	channels: [ '#lab3ss' ],
  connection: {
    reconnect: true,
  },
  /*
  identity: {
    username: 'lab3ss',
    password: 'oauth:v5rm679g3j3r5d69wt4zkaf1bbgovn'
  }
  */
});


ircClient.connect().catch((err) => {
  console.error(err)
  process.exit(2)
})

displayChat(chat)

ircClient.on('chat', (channel, tags, message, self) => {
  const username = (tags['display-name'] || tags.username).slice(0, 12)
  chat.push({
    username,
    message: parseEmote(message, tags.emotes),
    color: getUserColor(username),
    emotes: tags.emotes
  })
  displayChat(chat)
});

ircClient.on('join', (channel, username, self) => {
  if (displayJoin) {
    chat.push({
      username: '',
      message: `^/^+${username}^:^/ vient de nous rejoindre, bienvenu a toi !`,
      color: 'k',
    })
    chat.push({
      username: '',
      message: '',
      color: 'k',
    })
    displayChat(chat)
  }
  newSpecs.push(username)
});
ircClient.on('part', (channel, username, self) => {
  console.log(username, ' left')
});

const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    'Client-Id': CLIENT_ID,
    'Authorization': `Bearer ${ACCESS_TOKEN}`
  }
});

getUserInfos(axiosInstance, USER_LOGIN)
  .then(
    ({ id, name, description }) => {
      user.id = id
      user.name = name
      user.description = description

      getChannelInfos(axiosInstance, user.id).then(({ category, title }) => {
        channel.category = category
        channel.title = title

        getLastFollower(axiosInstance, user.id).then(({ total, last }) => {
          followersNumber = total
          lastFollower = last.from_name
        })
      })
    }
  )


setInterval(() => {
  if (user.id) {
    getLastFollower(axiosInstance, user.id).then(({ total, last }) => {
      if (total > followersNumber) {
        chat.push({
            username: 'Lab3ss',
            message: `Merci ^+${last}^: pour le follow <3`,
            color: getUserColor('Lab3ss'),
        })
        followersNumber = total
        notif('Follow +', last, true)
      } 
    })
  }
}, 10000)

setTimeout(() => {
  displayJoin = true
}, 30000)
