import axios from "https://cdn.skypack.dev/axios";

/**
 * Simple translator for Seanime extension
 * (uses LibreTranslate public server).
 */
async function translate(text, targetLang = "es") {
  if (!text) return "";
  try {
    const res = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: "auto",
      target: targetLang,
      format: "text"
    });
    return res.data.translatedText;
  } catch (err) {
    console.error("Translate error:", err);
    return text;
  }
}

// Seanime extension entry
export default function (ctx) {
  ctx.registerSettings([
    {
      key: "targetLang",
      type: "string",
      default: "es",
      label: "Target Language"
    }
  ]);

  const lang = ctx.settings.get("targetLang");

  ctx.registerAnimeSource({
    id: "translated-anilist",
    name: "Translated AniList",
    async search(query) {
      const results = await ctx.fetchAnime(query);
      return Promise.all(
        results.map(async (anime) => ({
          ...anime,
          title: await translate(anime.title, lang),
          description: await translate(anime.description, lang),
        }))
      );
    }
  });
}
