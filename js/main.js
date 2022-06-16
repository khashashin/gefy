document.addEventListener('DOMContentLoaded', main, false);

const body = document.querySelector('body');
const html = document.querySelector('html');
const modal = document.querySelector('.modal');
const closeIcon = modal.querySelector('img.icon.compare');
const compareIcon = modal.querySelector('img.icon.slide');
const slideIcon = modal.querySelector('img.icon.close');

let currentOriginalPhoto = null;
let currentEditedPhoto = null;

document.querySelector('.modal').querySelector('.icon.close').addEventListener('click', closePhotoComparisonWindow);
document.querySelector('.modal').querySelector('.icon.compare').addEventListener('click', comparePhoto);
document.querySelector('.modal').querySelector('.icon.slide').addEventListener('click', slidePhoto);

async function openPhotoModal(originalPath, editedPath) {
    currentEditedPhoto = editedPath;
    currentOriginalPhoto = originalPath;
    
    await sideBySideComparison();
    modal.style.display = 'block';

    return Promise.resolve();
}

async function displayMetaInfo(originalPath, editedPath) {
    console.log(originalPath, editedPath);
}

async function addCardClickEventListener(card) {
    // disableScroll();

    const cardBody = card.querySelector('.card-body');
    const photo = cardBody.querySelector('img');

    const originalPath = cardBody.dataset.path
    const editedPath = cardBody.dataset.pathEdited

    photo.addEventListener('click', async function() {
        await openPhotoModal(originalPath, editedPath);
    });

    const cardFooter = card.querySelector('.card-footer');
    const infoButton = cardFooter.querySelector('img');

    infoButton.addEventListener('click', async function() {
        await displayMetaInfo(originalPath, editedPath);
    });
}

async function createCardAppendToSection(card, section) {
    const c = document.createElement('div');
    c.classList.add('card');
    c.innerHTML = card;
    section.appendChild(c);
    
    await addCardClickEventListener(c);

    return Promise.resolve();
}

function main() {
    const mainWrapper = document.querySelector('main');
    
    const sectionEleasar = document.createElement('section');
    const sectionYusuf = document.createElement('section');
    const sectionFranz = document.createElement('section');

    sectionEleasar.classList.add('photos', 'eleasar');
    sectionYusuf.classList.add('photos', 'yusuf');
    sectionFranz.classList.add('photos', 'franz');

    mainWrapper.prepend(sectionFranz);
    mainWrapper.prepend(sectionYusuf);
    mainWrapper.prepend(sectionEleasar);

    // Load data from local file data.json
    fetch('assets/data-v2.json', {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then(data => {

        // Data contains list of paths to original and edited photos
        for (let i = 0; i < data.length; i++) {

            let card = `
                <div class="card-body" data-path="${data[i].path}" data-path-edited="${data[i].pathEdited}">
                    <img src="${data[i].path}" alt="${data[i].data}">
                </div>
                <div class="card-footer">
                    <p>${data[i].data}</p>
                    <img class="icon info" src="../assets/icons/info.svg" data-path="${data[i].path}" data-path-edited="${data[i].pathEdited}">
                </div>
            `;

            // Append cards to the appropriate section
            if (data[i].path.includes('assets/img/e/')) {
                createCardAppendToSection(card, sectionEleasar);
            }
            
            else if (data[i].path.includes('assets/img/y/')) {
                createCardAppendToSection(card, sectionYusuf);
            }
            
            else if (data[i].path.includes('assets/img/f/')) {
                createCardAppendToSection(card, sectionFranz);
            }
        }
    }).catch(error => {
        console.log(error);
    }).finally(() => {
        //createEventListeners();
        const isLoading = document.querySelector('p#loading');
        isLoading.style.display = 'none';
    })
}

async function createEventListeners() {
    const cards = document.querySelectorAll('.card-body');
    
    for (let i = 0; i < cards.length; i++) {
        const currentCard = cards[i];
        const imageMetaInfoButton = currentCard.parentElement.querySelector('.card-footer').querySelector('.icon.info');

        currentCard.addEventListener('click', function() {
            currentOriginalPhoto = this.getAttribute('data-path');
            currentEditedPhoto = this.getAttribute('data-path-edited');

            openPhotoComparisonWindow(() => {
            });
        });

        imageMetaInfoButton.addEventListener('click', function() {
            openPhotoMetaInfo(this, () => {
                document.querySelector('.modal').querySelector('.icon.close').addEventListener('click', closePhotoMetaInfo);
            });
        });
    }
}

function openPhotoComparisonWindow(callback) {
    disableScroll();

    sideBySideComparison();

    const mainWindow = document.querySelector('.modal');
    const closeIcon = document.createElement('img');
    const compareIcon = document.createElement('img');
    const slideIcon = document.createElement('img');

    closeIcon.classList.addMany('icon close');
    closeIcon.src = '../assets/icons/close.svg';
    compareIcon.classList.addMany('icon compare');
    compareIcon.src = '../assets/icons/compare.svg';
    slideIcon.classList.addMany('icon slide');
    slideIcon.src = '../assets/icons/slide.svg';

    if (mainWindow) {
        mainWindow.querySelector('.modal-footer').appendChild(compareIcon);
        mainWindow.querySelector('.modal-footer').appendChild(slideIcon);
        mainWindow.querySelector('.modal-footer').appendChild(closeIcon);
        mainWindow.style.display = 'block';
        return callback();
    }
}

async function sideBySideComparison() {

    await restoreComparisonState();

    const originalPhoto = document.createElement('img');
    const editedPhoto = document.createElement('img');
    
    originalPhoto.classList.add('photo', 'side-by-side');
    editedPhoto.classList.add('photo', 'side-by-side');
    originalPhoto.src = currentOriginalPhoto;
    editedPhoto.src = currentEditedPhoto;

    modal.querySelector('.modal-body').appendChild(originalPhoto);
    modal.querySelector('.modal-body').appendChild(editedPhoto);

    return Promise.resolve();
}

async function sliderComparison() {

    const originalPhoto = document.createElement('img');
    const editedPhoto = document.createElement('img');
    const editedPhotoWrapper = document.createElement('div');

    await restoreComparisonState();
    
    originalPhoto.src = currentOriginalPhoto;
    editedPhoto.src = currentEditedPhoto;
    originalPhoto.classList.add('photo');
    editedPhoto.classList.add('photo');

    modal.classList.add('beer-slider');
    modal.id = 'slider';
    modal.dataset.beerLabel = 'before';
    modal.querySelector('.modal-body').appendChild(originalPhoto);

    editedPhotoWrapper.classList.add('beer-reveal');
    editedPhotoWrapper.dataset.beerLabel = 'after';
    editedPhotoWrapper.appendChild(editedPhoto);
    modal.querySelector('.modal-body').appendChild(editedPhotoWrapper);

    new BeerSlider(document.getElementById('slider'));

    return Promise.resolve();
}

async function restoreComparisonState() {
    const modalBody = modal.querySelector('.modal-body');
    // clear modal body
    while (modalBody.firstChild) {
        modalBody.removeChild(modalBody.firstChild);
    }
    modalBody.id = '';
    modalBody.classList.remove('beer-slider');
    modalBody.classList.remove('beer-ready');
    delete modalBody.dataset.beerLabel;

    return Promise.resolve();
}

async function closePhotoComparisonWindow() {
    await enableScroll();

    modal.style.display = 'none';
    modal.querySelectorAll('.photo')
        .forEach(photo => {
            photo.remove();
        }
    );

    await restoreComparisonState();
}

function openPhotoMetaInfo(that, callback) {
    disableScroll();

    const modal = document.querySelector('.modal');
    const photo = document.createElement('img');
    const closeIcon = document.createElement('img');

    photo.src = that.parentElement.parentElement.querySelector('.card-body').getAttribute('data-path');
    photo.style.display = 'none';
    closeIcon.classList.addMany('icon close');
    closeIcon.src = '../assets/icons/close.svg';

    modal.querySelector('.modal-body').classList.add('meta-info');

    if (modal) {
        EXIF.getData(photo, function() {
            const metaData = {
                brightnessValue: this.exifdata.BrightnessValue,
                date: this.exifdata.DateTimeOriginal,
                exposureMode: this.exifdata.ExposureMode,
                exposureProgram: this.exifdata.ExposureProgram,
                exposureTime: this.exifdata.ExposureTime,
                fNumber: this.exifdata.FNumber,
                flash: this.exifdata.Flash,
                focalLength: this.exifdata.FocalLength,
                focalLengthIn35mmFilm: this.exifdata.FocalLengthIn35mmFilm,
                iso: this.exifdata.ISOSpeedRatings,
                lightSource: this.exifdata.LightSource,
                make: this.exifdata.Make,
                maxApertureValue: this.exifdata.MaxApertureValue,
                meteringMode: this.exifdata.MeteringMode,
                model: this.exifdata.Model,
                orientation: this.exifdata.Orientation,
                sceneCaptureType: this.exifdata.SceneCaptureType,
                software: this.exifdata.Software,
                whiteBalance: this.exifdata.WhiteBalance
            }

            const metaInfoHeader = document.createElement('h4');
            metaInfoHeader.innerHTML = 'Meta info';
            modal.querySelector('.modal-body').appendChild(metaInfoHeader);

            for (let key in metaData) {
                const metaInfoItem = document.createElement('p');
                metaInfoItem.classList.addMany('p-0 m-0');
                metaInfoItem.innerHTML = `${key}: ${metaData[key]}`;
                modal.querySelector('.modal-body').appendChild(metaInfoItem);
            }

            modal.querySelector('.modal-footer').appendChild(closeIcon);
            modal.style.display = 'block';
            return callback();
        });
    }
}

function closePhotoMetaInfo() {
    enableScroll();

    const modal = document.querySelector('.modal');
    const modalBody = modal.querySelector('.modal-body');
    if (modal) {
        modal.style.display = 'none';
        modalBody.querySelectorAll('p')
            .forEach(p => {
                p.remove();
            }
        );
        modal.querySelector('.icon.close').removeEventListener('click', closePhotoMetaInfo);
        modal.querySelectorAll('.icon')
            .forEach(icon => {
                icon.remove();
            }
        );
        modalBody.querySelector('h4').remove();
        modalBody.classList.remove('meta-info');
    }
}

async function comparePhoto() {
    await sideBySideComparison();

    modal.style.display = 'block';

    return Promise.resolve();
}

async function slidePhoto() {
    await sliderComparison();

    modal.style.display = 'block';

    return Promise.resolve();
}

function disableScroll() {
    body.style.overflowX = 'hidden';
    html.style.overflowX = 'hidden';
}

async function enableScroll() {
    body.style.overflowX = 'auto';
    html.style.overflowX = 'auto';

    return Promise.resolve();
}

DOMTokenList.prototype.addMany = function(classes) {
    var array = classes.split(' ');
    for (var i = 0, length = array.length; i < length; i++) {
      this.add(array[i]);
    }
}

DOMTokenList.prototype.removeMany = function(classes) {
    var array = classes.split(' ');
    for (var i = 0, length = array.length; i < length; i++) {
      this.remove(array[i]);
    }
}
