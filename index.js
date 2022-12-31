const { Telegraf } = require('telegraf');
const request = require('request');
const bot = new Telegraf('');

class Anime {
    constructor(name, descr, photo, link) {
        this._name = name;
        this._descr = descr;
        this._photo = photo;
        this._link = link;
    }
    static getRandomNumber() {
        return Math.floor(Math.random() * 14200);
    };

    get name() {
        return this._name;
    };

    get descr() {
        return this._descr;
    }

    get photo() {
        return this._photo;
    }

    get link() {
        return this._link;
    }

}
let anime = {}
const getAnime = (id) => {
    

    request(`http://kitsu.io/api/edge/anime?filter[id]=${id}`, function (error, response, body) {
        if (!error) {
            const object = JSON.parse(body);
            try {
                const name = object['data'][0]['attributes']['slug'];
                const descr = object['data'][0]['attributes']['description'];
                const photo = object['data'][0]['attributes']['posterImage']['small'];
                const link = object['data'][0]['links']['self']
                anime =  new Anime(name, descr, photo, link)
  
                
            } catch {
                getAnime(Anime.getRandomNumber())
            }





        }
    });
    return anime

}
const firstKeyBoard = [
    [
        { text: 'Get random anime  ➡', callback_data: 'random' },
    ],
    [{ text: 'Subscribe to my Instagram', url: 'https://instagram.com/' }],
]


bot.command('start', (ctx) => {
    ctx.reply('Hi, this is a bot in which you can find random anime 🙂', {
        reply_markup: {
            inline_keyboard: firstKeyBoard
        }
    })
})

bot.command('help', (ctx) => {
    ctx.reply('This is a bot in which you can find random anime.\nI have over 14,000 anime in my database.\nMy api is https://kitsu.io')

})

bot.on('text', () => {

})

bot.action('random', (ctx) => {
    const id = Anime.getRandomNumber();
    let animeData = getAnime(id);
    if(!!animeData.name){
        ctx.editMessageText(`Anime: ${animeData.name}\nDescription: ${animeData.descr}\n${animeData.photo} 🖤`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Get again random anime  🔁', callback_data: 'random' },
                        { text: 'Link  👉', url: animeData.link}
                    ],
                    [{ text: 'Subscribe to my Instagram', url: 'https://instagram.com/' }],
                ]
            }

        })
    }
        



})
bot.launch();