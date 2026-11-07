const axios = require("axios");

const { getStreamFromURL } = global.utils;

const API = "https://genx.neokex.xyz";

const MODEL = {
  gen: { path: "/generate" },
  edit: { path: "/img2img" }
};

const GUIDE = "🐊 NEOKEX GENX\n"
  + "• genx <prompt> [--ar <w:h>] [--size <WxH>] [--nsfw] [--style <text>]\n"
  + "• genx --s <preset> [--i <imgurl>] [--set <axis=value,...>]\n"
  + "• reply to an image with: genx --s <preset>\n"
  + "• genx --s — list presets";

function parse(args) {
  const flags = {};
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    const token = args[i];
    if (token.startsWith("--")) {
      const key = token.slice(2).toLowerCase();
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      rest.push(token);
    }
  }
  return { flags, rest };
}

function findImage(flags, event) {
  let image = flags.i || flags.img || flags.imgurl || flags.image;
  if (typeof image !== "string") image = undefined;
  const replied = event && event.messageReply;
  if (!image && replied && Array.isArray(replied.attachments)) {
    const att = replied.attachments.find(a => a.url && (
      ["photo", "image", "animated_image", "gif", "video"].includes(a.type) ||
      /\.(png|jpe?g|webp|gif|mp4|mov)$/i.test(a.url)
    ));
    if (att) image = att.url;
  }
  return image;
}

function ratioToSize(ar, base) {
  const m = /^(\d+)\s*[:x/]\s*(\d+)$/.exec(String(ar).trim());
  if (!m) return null;
  const rw = Number(m[1]);
  const rh = Number(m[2]);
  if (!rw || !rh) return null;
  if (rw >= rh) return { width: base, height: Math.round(base * rh / rw) };
  return { width: Math.round(base * rw / rh), height: base };
}

async function callApi(path, params) {
  const res = await axios.get(API + path, {
    params,
    timeout: 600000,
    validateStatus: () => true
  });
  return res.data;
}

function react(api, message, messageID, emoji) {
  try {
    if (api && typeof api.setMessageReaction === "function") {
      api.setMessageReaction(emoji, messageID, () => {}, true);
      return;
    }
  } catch (e) {}
  try {
    if (typeof message.reaction === "function") message.reaction(emoji, messageID);
  } catch (e) {}
}

function resultUrl(data) {
  const r = (data && data.result) || {};
  return r.resultUrl || r.url || (data && (data.resultUrl || data.url));
}

async function sendMedia(message, data) {
  const url = resultUrl(data);
  if (!url) return false;
  const stream = await getStreamFromURL(url);
  const ext = (url.split("?")[0].match(/\.(png|jpe?g|webp|gif|mp4|mov)$/i) || [null, "png"])[1];
  if (stream && typeof stream === "object") stream.path = `genx.${ext}`;
  await message.reply({ attachment: stream });
  return true;
}

async function listPresets(message) {
  const data = await callApi("/presets", {});
  if (!data || !Array.isArray(data.presets)) return false;
  const lines = data.presets.map(p => `• ${p.styleId} — ${p.label}`);
  return message.reply(`🧩 Presets (${lines.length})\n${lines.join("\n")}`);
}

module.exports = {
  config: {
    name: "genx",
    version: "3.0.0",
    author: "Neoaz 🐊",
    countDown: 5,
    role: 0,
    shortDescription: { en: "NEOKEX GENX image generator and editor" },
    longDescription: { en: "Generate and edit images through the NEOKEX GENX API." },
    category: "image",
    guide: {
      en: "{pn} <prompt> [--ar <w:h>] [--size <WxH>] [--nsfw] [--style <text>]\n"
        + "{pn} --s <preset> [--i <imgurl>] [--set <axis=value,...>]\n"
        + "reply to an image with: {pn} --s <preset>\n"
        + "{pn} --s"
    }
  },

  onStart: async function ({ api, message, args, event }) {
    const messageID = event.messageID;
    const { flags, rest } = parse(args);

    if (!args.length || flags.help || flags.h)
      return message.reply(GUIDE);
    if (flags.s === true) return listPresets(message);

    const preset = typeof flags.s === "string" ? flags.s : undefined;
    const prompt = rest.join(" ").trim();
    const image = findImage(flags, event);

    const mode = (image || preset) ? "edit" : "gen";
    const model = MODEL[mode];

    if (mode === "gen" && !prompt)
      return message.reply("❌ gen needs a prompt. Try: genx <prompt>");
    if (mode === "edit" && !image)
      return message.reply("❌ edit needs an image. Reply to one or pass --i <imgurl>");
    if (mode === "edit" && !preset && !prompt)
      return message.reply("❌ edit needs a preset. Try: genx --s <preset>");

    const allowed = new Set(["ar", "size", "s", "style", "set", "nsfw", "i", "img", "imgurl", "image", "help", "h"]);
    for (const key of Object.keys(flags)) {
      if (allowed.has(key)) continue;
      return message.reply(`❌ Unknown flag: --${key}\nAllowed: --s --i --ar --size --nsfw --style --set`);
    }

    const params = {};
    if (image) params.imageUrl = image;
    if (preset) params.preset = preset;
    if (mode === "gen" && prompt) params.prompt = prompt;
    if (mode === "edit" && prompt) params.style = prompt;
    if (typeof flags.style === "string") params.style = flags.style;
    if (typeof flags.set === "string") params.set = flags.set;
    if (flags.nsfw === true || flags.nsfw === "1" || flags.nsfw === "true") params.nsfw = "1";

    if (typeof flags.size === "string") {
      if (!/^\d+[xX]\d+$/.test(flags.size.trim())) return message.reply("❌ Invalid --size, use e.g. --size 1024x1024");
      params.size = flags.size.trim().toLowerCase();
    } else if (typeof flags.ar === "string") {
      const size = ratioToSize(flags.ar, 1024);
      if (!size) return message.reply("❌ Invalid --ar, use e.g. --ar 1:1 or --ar 16:9");
      params.size = `${size.width}x${size.height}`;
    }

    react(api, message, messageID, "⌛");
    let data;
    try {
      data = await callApi(model.path, params);
    } catch (e) {
      return react(api, message, messageID, "❌");
    }

    try {
      const sent = data && data.ok !== false ? await sendMedia(message, data) : false;
      react(api, message, messageID, sent ? "✅" : "❌");
      if (!sent && data && data.error) message.reply(`❌ ${data.error}`);
    } catch (e) {
      react(api, message, messageID, "❌");
    }
  }
};
