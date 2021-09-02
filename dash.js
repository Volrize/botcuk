//-------------- TANIMLAMALAR --------------
const Discord = require("discord.js");
const dbl = require('dbl.cf')
const client = new Discord.Client({
  disableMentions: "everyone",
  ws: { intents: new Discord.Intents(Discord.Intents.ALL) }
});
require('discord-buttons')(client);
const efDB = require("efdb");
const db = new efDB({
  databaseName: "ekData",
  databaseFolder: "veriler",
  adapter: "YamlDB"
});
const fs = require("fs");
const moment = require("moment");
require("moment-duration-format");

//const millisCreated = new Date().getTime() - client.users.cache.get("554266211043770400").createdTimeStamp.getTime();
//    const daysCreated = moment.duration(millisCreated).format("Y [yıl], D [gün], H [saat], m [dakika], s [saniye]")

//----------- AYARLAMALAR ------------
client.ayarlar = {
  token: "",
  gelistirici: ["673802320454352917","673802320454352917"],
  oauthSecret: "c1YvLJZQEBAqBA8PvetUBBvpDE3ciQ0Z",
  callbackURL: "https://www.gummybot.cf/callback",
  id: "879712823591174154",
  prefix: "g!",
  goldlog: "839650661367939086"
};
client.commands = new Discord.Collection();

var deasync = require("deasync");

function userBul(ID) {
  return deasync(async (_ID, cb) => {
    let output = null;

    try {
      let user = await client.users.fetch(_ID);

      output = {
        tag: user.tag,
        avatar: user.avatarURL(),
        name: user.username,
        isbot: user.bot
      };
    } catch (err) {
      output = {
        tag: "Bulunamadı#0000",
        isbot: null,
        name: "Bulunamadı",
        avatar: client.user.avatarURL()
      };
    }

    cb(null, output);
  })(ID);
}

function kisalt(str) {
  var newstr = "";
  var koyulan = 0;
  if (str.length > 10) {
    dongu: for (var i = 0; i < str.length; i++) {
      const element = str.split("")[i];
      if (i >= 28) {
        if (koyulan < 3) {
          newstr += " .";
          koyulan++;
        } else {
          break dongu;
        }
      } else newstr += element;
    }
    return newstr;
  } else return str;
}

const zaman = moment
  .duration(client.uptime)
  .format(" D [gün], H [saat], m [dakika], s [saniye]");

function botista() {
  return {
    serverSize: client.guilds.cache.size,
    userSize: client.guilds.cache
      .reduce((a, b) => a + b.memberCount, 0)
      .toLocaleString(),
    emojiSize: client.emojis.cache.size.toLocaleString(),
    channelSize: client.channels.cache.size.toLocaleString(),
    uptime: moment
      .duration(client.uptime)
      .format(" D [gün], H [saat], m [dakika], s [saniye]")
  };
}

client.db = db;
client.stats = botista;
client.kisibul = userBul;
client.tools = {
  kisalt: kisalt
};
client.on("ready", async () => {
  console.log(`Bot Online`);
  require("./dash")(client);
});
let tag = "";
const ayarlar = require("./ayarlar.json");


const url = require("url")
const db2 = require('quick.db')
const path = require("path");

var express = require('express');
var app = express();
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const ms = require("ms")
var flash = require('connect-flash');
module.exports = (client) => {
const templateDir = path.resolve(`${process.cwd()}${path.sep}html`);

app.use("/css", express.static(path.resolve(`${templateDir}${path.sep}css`)));
//-- discord auth kısmı --
passport.serializeUser((user, done) => {
done(null, user);
});
passport.deserializeUser((obj, done) => {
done(null, obj);
});
  
app.use(flash());
passport.use(new Strategy({
clientID: client.ayarlar.id,
clientSecret: client.ayarlar.oauthSecret,
callbackURL: client.ayarlar.callbackURL,
scope: ["identify","guilds"],
passReqToCallback:true
},
(req, accessToken, refreshToken, profile, done) => {
 if(client.db.get(`karaliste.${profile.id}`)) return done(null, false, req.flash("karaliste", "Kurucular tarafından karalisteye alınmışsın!"));
      
     done(null, profile)
    
   var accessToke = accessToken
}));

app.use(session({
secret: '123',
resave: false,
saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
//-- bitüş --
app.locals.domain = process.env.PROJECT_DOMAIN;

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
extended: true
})); 



const renderTemplate = async (res, req, template, data = {}) => {
const baseData = {
bot: client,
path: req.path,
user: req.isAuthenticated() ? req.user : null
};
res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
};
//-- sayfalar --
app.get("/giris", (req, res, next) => {
if (req.session.backURL) {
req.session.backURL = req.session.backURL;
} else if (req.headers.referer) {
const parsed = url.parse(req.headers.referer);
if (parsed.hostname === app.locals.domain) {
req.session.backURL = parsed.path;
}
} else {
req.session.backURL = "/";
}
    next();
},
passport.authenticate("discord"));

app.get("/callback", passport.authenticate("discord", {
  failureRedirect: "/autherror" 
}), async (req, res) => {

if (req.session.backURL) {
const url = req.session.backURL;
req.session.backURL = null;
res.redirect(url);
} else {
res.redirect("/");
}
});
app.get("/autherror", async(req, res) => {
  if(req.flash("karaliste")[0]) return res.redirect(`/hata?type=blacklist`)
res.redirect(`/hata?type=blacklist`)
})
app.get("/cikis", function(req, res) {
req.session.destroy(() => {
req.logout();
res.redirect("/");
});
});
  //------------------------------------------------//

  app.get("/discord", async (req, res) => {
res.redirect("https://discord.gg/MPdtYV6hKY");
});
  
  app.get("/ekle", (req, res) => {
    res.redirect(`https://discord.com/oauth2/authorize?client_id=879712823591174154&scope=bot&permissions=2080907455`)
  })

  app.get("/oy", async (req, res) => {
renderTemplate(res, req, "oy.ejs");
});
  
app.get("/profil2/:id", async(req, res) => {
  let userr = client.kisibul(req.params["id"])
  let vip = client.db.get(`premium.${req.params["id"]}`) ? `<i class="far fa-check-circle" style="color:GREEN"></i>`: `<i class="far fa-times-circle" style="color:RED"></i>`
  renderTemplate(res, req, "profil.ejs", {userr,vip});
});
  

  
  
  
  app.get("/", async (req, res) => {
renderTemplate(res, req, "index.ejs");
});
  
app.get("/", async (req, res) => {
renderTemplate(res, req, "index.ejs");
});
  
app.get("/profile/:id", async(req, res) => {
  let userr = client.kisibul(req.params["id"])
  let vip = client.db.get(`premium.${req.params["id"]}`) ? `<i class="far fa-check-circle" style="color:GREEN"></i>`: `<i class="far fa-times-circle" style="color:RED"></i>`
  renderTemplate(res, req, "profile.ejs", {userr,vip});
});
  
app.get("/admin", async (req, res) => {
 if(!client.ayarlar.gelistirici.includes(req.user.id) ) return res.redirect('/')
renderTemplate(res, req, "admin/index.ejs");
});
  
app.get("/admin/gold-uye", async (req, res) => {
 if(!client.ayarlar.gelistirici.includes(req.user.id) ) return res.redirect('/')
renderTemplate(res, req, "admin/goldüye.ejs");
});
  
app.get("/admin/kara-liste", async (req, res) => {
 if(!client.ayarlar.gelistirici.includes(req.user.id) ) return res.redirect('/')
renderTemplate(res, req, "admin/kara-liste.ejs");
});
  
app.get("/bilgi", async (req, res) => {
renderTemplate(res, req, "hakkımızda.ejs");
});
  
  app.get("/premium", async (req, res) => {
renderTemplate(res, req, "premium.ejs");
});
  
app.get("/hata", async (req, res) => {
  let type = req.query.type || "Yazı Bulunamadı"
  let text = ""
  if(type === "auth") {
    text = "Girişte bir hata oluştu sonra tekrar deneyiniz."
  }else if(type === "eksik") {
    text = "Gerekli yerlerin hepsini doldurman gerekiyor!"
  }else if(type === "kayıt") {
    text = "Bilgileri kayıt ederken bir hata meydana geldi!"
  }else if(type === "bulunamadı") {
    text = "İstenilen yer bulunamadı!"
  }else if(type === "giris") {
    text = "Bu sayfaya girmek için giriş yapmalısın!"
  }else if(type === "blacklist") text = "Karalistedesin giriş yapamazsın!"
renderTemplate(res, req, "hata.ejs", {text});
});
  
app.get("/basarili", async (req, res) => {
  let type = req.query.type || "Yazı Bulunamadı"
  let text = ""
  if(type === "ayarlar") {
    text = "Girilen bilgiler kaydedildi!"
  }
renderTemplate(res, req, "basarili.ejs", {text});
});
  
app.get("/panel", async (req, res) => {
 if(!req.user) return res.redirect("/hata?type=giris")
     const perms = Discord.Permissions;
renderTemplate(res, req, "yonet.ejs", {perms});
});
  
app.get("/yonet", async(req, res) => {
  if(!req.user) return res.redirect("/hata?type=giris")
  let id = req.query.server
  if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
  renderTemplate(res, req, "yonet/server.ejs", {id})
})
  
app.get("/yonetim/:id/ayar", async(req, res) => {
  if(!req.user) return res.redirect("/hata?type=giris")
  let id = req.params.id
  if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
  renderTemplate(res, req, "yonetim/ayar.ejs", {id})
})
  
    app.get("/yonetim/:id/filtre", async(req, res) => {
  if(!req.user) return res.redirect("/hata?type=giris")
  let id = req.params.id
  if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
  renderTemplate(res, req, "yonetim/filtre.ejs", {id})
})
  
    app.get("/yonetim/:id/", async(req, res) => {
  if(!req.user) return res.redirect("/hata?type=giris")
  let id = req.params.id
  if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
  renderTemplate(res, req, "yonetim/log.ejs", {id})
})
  //------------------------------------------------//
  app.post("/admin/gold-uye", async(req, res) => {
    if(!client.ayarlar.gelistirici.includes(req.user.id) ) return res.redirect('/')
 if(req.body["gold-id"]) {
      client.db.set(`pre_${req.body["gold-id"]}`, true)
    }else if(req.body["usr-id"]) {
      client.db.delete(`premium_${req.body["gold-id"]}`)
    }
    res.redirect("/admin/gold-uye")
  })
  app.post("/yonetim/:id/ayar", async(req, res) => {
    let ayarlar = req.body
    console.log(ayarlar)
if(!req.user) return res.redirect("/hata?type=giris")
 let id = req.params.id
 if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
    if(ayarlar) {
      if(ayarlar["otorol-kanal"]) {
      client.db.set(`otoRK_${id}`, ayarlar["otorol-kanal"])
      }else{
        try {
        client.db.delete(`otoRK_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["otorol-rol"]) {
      client.db.set(`otoRL_${id}`, ayarlar["otorol-rol"])
      }else{
        try {
        client.db.delete(`otoRL_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["otorol-botrol"]) {
      client.db.set(`bototorol_${id}`, ayarlar["otorol-botrol"])
      }else{
        try {
        client.db.delete(`bototorol_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["sayac-kanal"]) {
      client.db.set(`sayacK_${id}`, ayarlar["sayac-kanal"])
      }else{
        try {
        client.db.delete(`sayacK_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["sayac-hedef"]) {
      client.db.set(`sayacS_${id}`, ayarlar["sayac-hedef"])
      }else{
        try {
        client.db.delete(`sayacS_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["kayıt-kanal"]) {
      client.db.set(`kayıtkanal_${id}`, ayarlar["kayıt-kanal"])
      }else{
        try {
        client.db.delete(`kayıtkanal_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["k-alıncak-rol"]) {
      client.db.set(`alınacakrol_${id}`, ayarlar["k-alıncak-rol"])
      }else{
        try {
        client.db.delete(`alınacakrol_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["k-erkek-rol"]) {
      client.db.set(`erkekrol_${id}`, ayarlar["k-erkek-rol"])
      }else{
        try {
        client.db.delete(`erkekrol_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["k-kız-rol"]) {
      client.db.set(`kızrol_${id}`, ayarlar["k-kız-rol"])
      }else{
        try {
        client.db.delete(`kızrol_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["hgbb-kanal"]) {
      client.db.set(`gçkanal_${id}`, ayarlar["hgbb-kanal"])
      }else{
        try {
        client.db.delete(`gçkanal_${id}`)
     } catch(err) {
       
     }
      }
    }else{
      
    }
  res.redirect("/basarili?type=ayarlar")
    })

  app.post("/yonetim/:id/filtre", async(req, res) => {
    let ayarlar = req.body
if(!req.user) return res.redirect("/hata?type=giris")
 let id = req.params.id
 if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
    if(ayarlar) {
      if(ayarlar["link-engel"] === "on") {
      client.db.set(`reklam.${id}.durum`, true)
      }else{
        try {
        client.db.delete(`reklam.${id}.durum`)
     } catch(err) {
       
     }
      }
      if(ayarlar["reklam-engel"] === "on") {
      client.db.set(`${id}.ayarlar.filtre.reklam`, true)
      }else{
        try {
        client.db.delete(`${id}.ayarlar.filtre.reklam`)
     } catch(err) {
       
     }
      }
      if(ayarlar["caps-engel"] === "on") {
      client.db.set(`${id}.ayarlar.filtre.caps`, true)
      }else{
        try {
        client.db.delete(`${id}.ayarlar.filtre.caps`)
     } catch(err) {
       
     }
      }
    }else{
      
    }
  res.redirect("/basarili?type=ayarlar")
    })
  
app.post("/panel/kara-add", (req, res) => {
  
  if(!client.ayarlar.gelistirici.includes(req.user.id) ) return res.redirect('/')
  let ayar = req.body
  if (ayar === {} || !ayar['kul-id']) return res.redirect('/admin')
  let id = ayar['kul-id']

  client.db.set(`karaliste.${id}`, true)  
  res.redirect('/admin')
  
});

  app.post("/panel/kara-remove", (req, res) => {
  
  if(!client.ayarlar.gelistirici.includes(req.user.id) ) return res.redirect('/')
 let ayar = req.body
  if (ayar === {} || !ayar['kul-id']) return res.redirect('/admin')
  let id = ayar['kul-id']

  client.db.delete(`karaliste.${id}`)  

  
  res.redirect('/admin')
  
});
  
  

  
app.listen(3000);
  
  
  
  //------------------------------------------------//
  
  };