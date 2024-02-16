import Swiper from 'swiper/swiper-bundle.min.mjs';
import 'swiper/swiper-bundle.css';

import Player from '@vimeo/player';

const VIDEO_URL = 'https://player.vimeo.com/video/';
const IMG_URL = 'https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com';

const swiperImagesWrapper = document.querySelector('.image-wrapper');
const swiperModalWrapper = document.querySelector('.modal-wrapper');
const modal = document.querySelector('[data-modal]');
const btnClose = document.querySelector('.modal-close-btn');
const body = document.querySelector('body');

const videoArray = [
  '824804225',
  '824804225',
  '824804225',
  '824804225',
  '824804225',
  '824804225',
  '824804225',
  '824804225',
];

let imagesArray = [];
let player;

getImagesSwiper();

async function getImagesSwiper() {
  try {
    imagesArray = await fetchImages();
    renderImagesList(imagesArray);
    new Swiper('.swiper-images', {
      slidesPerView: 4,
      slidesPerGroup: 4,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    const previewImage = document.querySelectorAll('.preview-image');
    previewImage.forEach((image, index) => {
      image.addEventListener('click', () => openModal(index));
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function fetchImages() {
  const arrayOfPromises = videoArray.map(async videoId => {
    const response = await fetch(`${IMG_URL}/${videoId}`)
      .then(data => data.json())
      .then(data => data.thumbnail_url);
    return response;
  });
  const imagesArray = await Promise.all(arrayOfPromises);
  return imagesArray;
}

function renderImagesList(imagesArray) {
  const markup = imagesArray
    .map(
      image =>
        `<img class="swiper-slide preview-image" src=${image} alt="preview for video" />`
    )
    .join('');
  swiperImagesWrapper.innerHTML = markup;
}

const ModalMarkUp = videoArray.map(
  video =>
    `<iframe
        src="${VIDEO_URL}${video}"
        class="swiper-slide"
         width="600" height="600"
        frameborder="0"
        allow="autoplay"
       webkitallowfullscreen mozallowfullscreen allowfullscreen
      ></iframe>`
);

swiperModalWrapper.innerHTML = ModalMarkUp;

const iframe = document.querySelectorAll('iframe');

const swiper2 = new Swiper('.swiper-video', {
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 20,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  on: {
    slideChange: swiper => {
      if (player) {
        player.unload();
      }
      player = new Player(iframe[swiper.activeIndex]);
      player.play();
    },
  },
});

function openModal(index) {
  modal.classList.toggle('is-hidden');
  body.classList.toggle('no-scroll');
  body.addEventListener('keydown', onEscPress);
  btnClose.addEventListener('click', closeModal);
  player = new Player(iframe[index]);
  swiper2.slideTo(index);
  player.play();
  player.getPlayed;
}

function closeModal() {
  modal.classList.toggle('is-hidden');
  body.classList.toggle('no-scroll');
  body.removeEventListener('keydown', onEscPress);
  btnClose.removeEventListener('click', closeModal);
  player.unload();
  player = null;
}

function onEscPress(key) {
  if (key.code === 'Escape') {
    closeModal();
  }
}
