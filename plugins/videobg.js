/* Copyright (C) 2020 Yusuf Usta.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
WhatsAsena - Yusuf Usta
*/

const Asena = require('../events');
const {MessageType, Mimetype} = require('@adiwajshing/baileys');
const Config = require('../config');
const fs = require('fs');
const got = require('got');
const FormData = require('form-data');
const stream = require('stream');
const {promisify} = require('util');

const pipeline = promisify(stream.pipeline);

const Language = require('../language');
const Lang = Language.getString('removebg');

if (Config.WORKTYPE == 'private') {

    Asena.addCommand({pattern: 'videorbg ?(.*)', fromMe: true, desc: Lang.REMOVEBG_DESC}, (async (message, match) => {    

        if (message.reply_message === false || message.reply_message.video === false) return await message.client.sendMessage(message.jid,Lang.NEED_PHOTO,MessageType.text);
        if (Config.RBGVIDEO_API_KEY === false) return await message.client.sendMessage(message.jid,Lang.NO_API_KEY.replace('remove.bg', 'https://github.com/phaticusthiccy/WhatsAsenaDuplicated/wiki/Remove-BG-API-Key'),MessageType.text);
    
        var load = await message.reply(Lang.RBGING);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        var form = new FormData();
        form.append('video_file', fs.createReadStream(location));
        form.append('size', 'auto');

        var rbg = await got.stream.post('https://api.unscreen.com/v1.0/videos', {
            body: form,
            headers: {
                'X-Api-Key': Config.RBGVIDEO_API_KEY
            }
        }); 
    
        await pipeline(
		    rbg,
		    fs.createWriteStream('rbg.mp4')
        );
    
        await message.client.sendMessage(message.jid,fs.readFileSync('rbg.mp4'), MessageType.document, {filename: 'W5-BOT.mp4', mimetype: Mimetype.mp4, quoted: message.data});
        await load.delete();
    }));
}
else if (Config.WORKTYPE == 'public') {

    Asena.addCommand({pattern: 'videorbg ?(.*)', fromMe: false, desc: Lang.REMOVEBG_DESC}, (async (message, match) => {    

        if (message.reply_message === false || message.reply_message.video === false) return await message.client.sendMessage(message.jid,Lang.NEED_PHOTO,MessageType.text);
        if (Config.RBGVIDEO_API_KEY === false) return await message.client.sendMessage(message.jid,Lang.NO_API_KEY.replace('remove.bg', 'https://github.com/phaticusthiccy/WhatsAsenaDuplicated/wiki/Remove-BG-API-Key'),MessageType.text);
    
        var load = await message.reply(Lang.RBGING);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        var form = new FormData();
        form.append('video_file', fs.createReadStream(location));
        form.append('size', 'auto');

        var rbg = await got.stream.post('https://api.unscreen.com/v1.0/videos', {
            body: form,
            headers: {
                'X-Api-Key': Config.RBGVIDEO_API_KEY
            }
        }); 
    
        await pipeline(
		    rbg,
		    fs.createWriteStream('rbg.mp4')
        );
    
        await message.client.sendMessage(message.jid,fs.readFileSync('rbg.mp4'), MessageType.document, {filename: 'W5-BOT.mp4', mimetype: Mimetype.mp4, quoted: message.data});
        await load.delete();
    }));
    
}