export function getYoutubeThumbnail(url: string) {
  try {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "https://placehold.co/600x400";
  } catch {
    return "https://placehold.co/600x400";
  }
}