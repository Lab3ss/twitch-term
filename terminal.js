const term = require( 'terminal-kit' ).terminal

const colors = ['r', 'g', 'y', 'b', 'm', 'c']
let colorIndex = 0

const userColorMapping = {}

term.hideCursor()

const displayChat = (chat) => {
  term.clear()
  term.table(chat.map((m, i) => [(i > 0 && chat[i].username === chat[i-1].username) || !m.username ? '' : `^+^${m.color}${m.username}^:: `, m.message]), {
		hasBorder: false ,
		contentHasMarkup: true ,
		textAttr: { bgColor: 'none' } ,
		fit: true   // Activate all expand/shrink + wordWrap
	}
) ;
}

const getUserColor = (username) => {
  if (!userColorMapping[username]) {
    userColorMapping[username] = colors[colorIndex]
    colorIndex = colorIndex === colors.length - 1 ? 0 : colorIndex + 1
  } 
  return userColorMapping[username]
}

const parseEmote = (message, emotes) => {
  if (!emotes) {
    return message
  }
  const found = []
  let newMessage = message
  Object.values(emotes).forEach(limits => {
    [start, end] = limits[0].split('-')
    found.push(message.substr(parseInt(start), parseInt(end) - parseInt(start) + 1))
  })
  for (const f of found) {
    var regex = new RegExp(f,"g");
    newMessage = newMessage.replace(regex, `^+[emote: ${f}]^:`)
  }
  return newMessage
}

const notif = (title, text, bell) => {
  if (bell) {
    term.bell()
  }
  term.notify(title, text)
}

module.exports = { displayChat, getUserColor, parseEmote, notif }

