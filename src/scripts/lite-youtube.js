// "Lite embed": el reproductor de YouTube només es carrega quan l'usuari prem Play,
// i sempre des de youtube-nocookie.com. Cap iframe ni SDK abans de la interacció.
const EMBED_ORIGIN = 'https://www.youtube-nocookie.com/embed/';

function play(frame) {
  const { videoId, videoTitle } = frame.dataset;
  const iframe = document.createElement('iframe');
  iframe.className = 'video__iframe';
  iframe.src = `${EMBED_ORIGIN}${encodeURIComponent(videoId)}?autoplay=1`;
  iframe.title = videoTitle;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';

  frame.replaceChildren(iframe);
  frame.classList.add('is-playing');
  iframe.focus();
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('.video__play');
  if (button) play(button.closest('.video__frame'));
});
