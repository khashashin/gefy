document.addEventListener('DOMContentLoaded', main, false);

const body = document.querySelector('body');
const html = document.querySelector('html');

let currentOriginalPhoto = null;
let currentEditedPhoto = null;

function main() {
    let container = document.querySelector('.container');

    fetch('assets/data-v2.json', {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then(data => {
        for (let i = 0; i < data.length; i++) {

            let card = `
                <div class="card">
                    <div class="card-body" data-path="${data[i].path}" data-path-edited="${data[i].pathEdited}">
                        <img src="${data[i].path}" alt="${data[i].data}">
                    </div>
                    <div class="card-footer">
                        <p>${data[i].data}</p>
                        <img class="icon info" src="../assets/icons/info.svg" data-path="${data[i].path}" data-path-edited="${data[i].pathEdited}">
                    </div>
                </div>
            `;

            container.innerHTML += card;
        }
    }).catch(error => {
        console.log(error);
    }).finally(() => {
        createEventListeners();
    })
}

function createEventListeners() {
    const images = document.querySelectorAll('.card-body');
    
    for (let i = 0; i < images.length; i++) {
        const currentImage = images[i];
        const imageMetaInfoButton = currentImage.parentElement.querySelector('.card-footer').querySelector('.icon.info');

        currentImage.addEventListener('click', function() {
            currentOriginalPhoto = this.getAttribute('data-path');
            currentEditedPhoto = this.getAttribute('data-path-edited');

            openPhotoComparisonWindow(() => {
                document.querySelector('.modal').querySelector('.icon.close').addEventListener('click', closePhotoComparisonWindow);
                document.querySelector('.modal').querySelector('.icon.compare').addEventListener('click', comparePhoto);
                document.querySelector('.modal').querySelector('.icon.slide').addEventListener('click', slidePhoto);
            });
        });

        imageMetaInfoButton.addEventListener('click', function() {
            openPhotoMetaInfo(() => {
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

function sideBySideComparison() {

    restoreComparisonState((() => {
        const mainWindow = document.querySelector('.modal');
        const originalPhoto = document.createElement('img');
        const editedPhoto = document.createElement('img');
    
        originalPhoto.classList.addMany('photo side-by-side');
        editedPhoto.classList.addMany('photo side-by-side');
    
        if (mainWindow) {
            originalPhoto.src = currentOriginalPhoto;
            editedPhoto.src = currentEditedPhoto;
            mainWindow.querySelector('.modal-body').appendChild(originalPhoto);
            mainWindow.querySelector('.modal-body').appendChild(editedPhoto);
        }
    }));
}

function sliderComparison() {

    restoreComparisonState(() => {
        const modal = document.querySelector('.modal-body');
        const originalPhoto = document.createElement('img');
        const editedPhoto = document.createElement('img');
        const editedPhotoWrapper = document.createElement('div');
        if (modal) {
            originalPhoto.src = currentOriginalPhoto;
            editedPhoto.src = currentEditedPhoto;
            originalPhoto.classList.add('photo');
            editedPhoto.classList.add('photo');

            modal.classList.add('beer-slider');
            modal.id = 'slider';
            modal.dataset.beerLabel = 'before';
            modal.appendChild(originalPhoto);

            editedPhotoWrapper.classList.add('beer-reveal');
            editedPhotoWrapper.dataset.beerLabel = 'after';
            editedPhotoWrapper.appendChild(editedPhoto);
            modal.appendChild(editedPhotoWrapper);

            new BeerSlider(document.getElementById('slider'));
        }
    })
}

function restoreComparisonState(callback) {
    const modal = document.querySelector('.modal');
    if (modal === null) {
        return;
    }

    const modalBody = modal.querySelector('.modal-body');
    // clear modal body
    while (modalBody.firstChild) {
        modalBody.removeChild(modalBody.firstChild);
    }
    modalBody.id = '';
    modalBody.classList.remove('beer-slider');
    modalBody.classList.remove('beer-ready');
    delete modalBody.dataset.beerLabel;

    return callback();
}

function closePhotoComparisonWindow() {
    enableScroll();

    const mainWindow = document.querySelector('.modal');

    if (mainWindow) {
        mainWindow.style.display = 'none';
        mainWindow.querySelectorAll('.photo')
            .forEach(photo => {
                photo.remove();
            }
        );
        mainWindow.querySelector('.icon.close').removeEventListener('click', closePhotoComparisonWindow);
        mainWindow.querySelector('.icon.compare').removeEventListener('click', comparePhoto);
        mainWindow.querySelector('.icon.slide').removeEventListener('click', slidePhoto);

        mainWindow.querySelectorAll('.icon')
            .forEach(icon => {
                icon.remove();
            }
        );
    }
}

function openPhotoMetaInfo(callback) {
    disableScroll();

    const modal = document.querySelector('.modal');
    const photo = document.createElement('img');
    const closeIcon = document.createElement('img');

    photo.src = currentEditedPhoto;
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

function comparePhoto() {
    sideBySideComparison();
}

function slidePhoto() {
    sliderComparison();
}

function disableScroll() {
    body.style.overflowX = 'hidden';
    body.style.overflowY = 'auto';
    html.style.overflowX = 'hidden';
    html.style.overflowY = 'auto';
}

function enableScroll() {
    body.style.overflowX = 'auto';
    body.style.overflowY = 'auto';
    html.style.overflowX = 'auto';
    html.style.overflowY = 'auto';
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
