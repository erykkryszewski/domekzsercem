import $ from 'jquery';

document.addEventListener('DOMContentLoaded', function () {
  const fileLinks = document.querySelectorAll('.iframe__link--file');

  fileLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const videoSrc = this.getAttribute('href');
      const overlay = this.closest('.iframe__overlay');
      const videoHeight = overlay ? overlay.offsetHeight + 'px' : 'auto';

      const videoElement = document.createElement('video');
      videoElement.setAttribute('controls', '');
      videoElement.style.width = '100%';
      videoElement.style.height = videoHeight;

      const sourceElement = document.createElement('source');
      sourceElement.setAttribute('src', videoSrc);
      sourceElement.setAttribute('type', 'video/mp4');

      videoElement.appendChild(sourceElement);

      const placeholder = document.createElement('div');
      placeholder.appendChild(videoElement);
      placeholder.style.display = 'none';
      document.body.appendChild(placeholder);

      $.fancybox.open({
        src: placeholder,
        type: 'inline',
        afterClose: function () {
          placeholder.remove();
        },
      });
    });
  });
});
