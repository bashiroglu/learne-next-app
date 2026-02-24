import { getGrammarVideos } from "@/lib/grammar-videos";
import { getListeningVideos } from "@/lib/listening";

const baseUrl = "https://learne.org";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [grammarVideos, listeningVideos] = await Promise.all([
    getGrammarVideos(),
    getListeningVideos(),
  ]);

  const grammarEntries = grammarVideos.map((video) => {
    const thumbnailUrl =
      video.thumbnail_url ||
      (video.youtube_id
        ? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
        : "");
    const embedUrl = video.youtube_id
      ? `https://www.youtube.com/embed/${video.youtube_id}`
      : "";
    const uploadDate = new Date(video.created_at).toISOString().split("T")[0];

    return `
  <url>
    <loc>${baseUrl}/grammar-videos/${video.slug}</loc>
    <video:video>
      ${thumbnailUrl ? `<video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>` : ""}
      <video:title>${escapeXml(video.title)}</video:title>
      ${video.description ? `<video:description>${escapeXml(video.description)}</video:description>` : ""}
      ${embedUrl ? `<video:player_loc>${escapeXml(embedUrl)}</video:player_loc>` : ""}
      <video:upload_date>${uploadDate}</video:upload_date>
    </video:video>
  </url>`;
  });

  const listeningEntries = listeningVideos.map((video) => {
    const thumbnailUrl =
      video.thumbnail_url ||
      (video.youtube_id
        ? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
        : "");
    const embedUrl = video.youtube_id
      ? `https://www.youtube.com/embed/${video.youtube_id}`
      : "";
    const uploadDate = new Date(video.created_at).toISOString().split("T")[0];

    return `
  <url>
    <loc>${baseUrl}/listening/${video.slug}</loc>
    <video:video>
      ${thumbnailUrl ? `<video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>` : ""}
      <video:title>${escapeXml(video.title)}</video:title>
      ${video.description ? `<video:description>${escapeXml(video.description)}</video:description>` : ""}
      ${embedUrl ? `<video:player_loc>${escapeXml(embedUrl)}</video:player_loc>` : ""}
      <video:upload_date>${uploadDate}</video:upload_date>
    </video:video>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${grammarEntries.join("")}
${listeningEntries.join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
