const Asena = require("../Utilis/events");
const { spawnSync } = require("child_process");
const Config = require("../config");
const Language = require("../language");
const { checkImAdmin } = require("../Utilis/Misc");
const { warn, getEachWarn } = require("../Utilis/warn");
const { getBuffer } = require("../Utilis/download");
const { MessageType } = require("@adiwajshing/baileys");
const Lang = Language.getString("system_stats");
let fm = true;

Asena.addCommand(
  { pattern: "warn ?(.*)", fromMe: fm, desc: "To warn", onlyGroup: true },
  async (message, match) => {
    if (match == 'list') {
      let msg = '';
      let users = await getEachWarn()
      if (!users) return await message.sendMessage('*Nothing to Display*')
      users.forEach(jid => {
        let { user, count, reason } = jid
        msg += Lang.WARN_MSG.format(user.split('@')[0], count, Config.WARN_COUNT - count, reason)
      })
      return await message.sendMessage(msg)
    }
    if (!message.reply_message && !message.mention)
      return await message.sendMessage(Lang.NEED_USER);
    let quoted = !message.reply_message ? undefined : message.quoted;
    let { user, count, reason } = await warn(message, match);
    if (reason == "reset") {
      return await message.sendMessage(Lang.RESET.format(user.split("@")[0], Config.WARN_COUNT - count),
        { quoted, contextInfo: { mentionedJid: [user] } }
      );
    }
    if (count >= Config.WARN_COUNT) {
      let participants = await message.groupMetadata(message.jid);
      let im = await checkImAdmin(participants, message.client.user.jid);
      if (!im) return await message.sendMessage(Lang.IAADMIN);
      let us = await checkImAdmin(participants, user);
      if (us) return await message.sendMessage(Lang.ISADMIN);
      await message.sendMessage(Config.WARN_MSG, { quoted });
      return await message.groupRemove(message.jid, user);
    }
    return await message.sendMessage(Lang.WARNING.format(user.split("@")[0], reason, Config.WARN_COUNT - count),
      { quoted, contextInfo: { mentionedJid: [user] } }
    );
  }
);
