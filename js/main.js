document.addEventListener('DOMContentLoaded', main, false);

const body = document.querySelector('body');
const html = document.querySelector('html');

const modalPhotos = document.getElementById('modal-photos');
const modalMeta = document.getElementById('modal-meta');

let currentOriginalPhoto = null;
let currentEditedPhoto = null;

modalPhotos.querySelector('.icon.close').addEventListener('click', closePhotoComparisonWindow);
modalPhotos.querySelector('.icon.compare').addEventListener('click', comparePhoto);
modalPhotos.querySelector('.icon.slide').addEventListener('click', slidePhoto);
modalMeta.querySelector('.icon.close').addEventListener('click', closePhotoMetaInfo)

async function openPhotoModal(originalPath, editedPath) {
    currentEditedPhoto = editedPath;
    currentOriginalPhoto = originalPath;
    
    await sideBySideComparison();
    modalPhotos.style.display = 'block';

    return Promise.resolve();
}

async function displayMetaInfo(originalPath) {
    await openPhotoMetaInfo(originalPath);

    return Promise.resolve();
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
    }).finally(async () => {
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

        currentCard.addEventListener('click', async function() {
            currentOriginalPhoto = this.getAttribute('data-path');
            currentEditedPhoto = this.getAttribute('data-path-edited');

            await openPhotoComparisonWindow();
        });

        imageMetaInfoButton.addEventListener('click', async function() {
            await openPhotoMetaInfo(this);
        });
    }
}

async function openPhotoComparisonWindow() {
    disableScroll();

    await sideBySideComparison();

    return Promise.resolve();
}

async function sideBySideComparison() {

    await restoreComparisonState();

    const originalPhoto = document.createElement('img');
    const editedPhoto = document.createElement('img');
    
    originalPhoto.classList.add('photo', 'side-by-side');
    editedPhoto.classList.add('photo', 'side-by-side');
    originalPhoto.src = currentOriginalPhoto;
    editedPhoto.src = currentEditedPhoto;

    modalPhotos.querySelector('.modal-body').appendChild(originalPhoto);
    modalPhotos.querySelector('.modal-body').appendChild(editedPhoto);

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

    modalPhotos.querySelector('.modal-body').classList.add('beer-slider');
    modalPhotos.querySelector('.modal-body').id = 'slider';
    modalPhotos.querySelector('.modal-body').dataset.beerLabel = 'before';
    modalPhotos.querySelector('.modal-body').appendChild(originalPhoto);

    editedPhotoWrapper.classList.add('beer-reveal');
    editedPhotoWrapper.dataset.beerLabel = 'after';
    editedPhotoWrapper.appendChild(editedPhoto);
    modalPhotos.querySelector('.modal-body').appendChild(editedPhotoWrapper);

    new BeerSlider(document.getElementById('slider'));

    return Promise.resolve();
}

async function restoreComparisonState() {
    const modalBody = modalPhotos.querySelector('.modal-body');
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

    modalPhotos.style.display = 'none';
    modalPhotos.querySelectorAll('.photo')
        .forEach(photo => {
            photo.remove();
        }
    );

    await restoreComparisonState();
}

async function openPhotoMetaInfo(originalPath) {
    disableScroll();
    const isLoading = document.getElementById('meta-info-loading');
    isLoading.style.display = 'block';

    const img = document.createElement('img');
    img.src = originalPath;

    getMetaInformation(img, () => {
        isLoading.style.display = 'none';
    });
}

async function getMetaInformation(photo, callback) {
    // get image by image path from photo
    const blobImage = new Blob([photo.src], {type: 'image/jpeg'});

    const fr = new FileReader();

    const tags = await ExifReader.load(blobImage);
    console.log(tags);

    callback();

/*     EXIF.getData(photo, function() {
        const metaData = {
            iso: this.exifdata.ISOSpeedRatings,
            maxApertureValue: this.exifdata.MaxApertureValue,
            exposureTime: this.exifdata.ExposureTime
        };

        for (let key in metaData) {
            const metaInfoItem = document.createElement('p');
            metaInfoItem.classList.add('p-0', 'm-0');
            metaInfoItem.innerHTML = `${key}: ${metaData[key]}`;
            modalMeta.querySelector('.modal-body').appendChild(metaInfoItem);
        }
        modalMeta.style.display = 'block';

        return callback();
    }); */
}

async function closePhotoMetaInfo() {
    await enableScroll();

    modalMeta.style.display = 'none';
    modalMeta.querySelectorAll('p')
        .forEach(p => {
            p.remove();
        }
    );
}

async function comparePhoto() {
    await sideBySideComparison();

    modalPhotos.style.display = 'block';

    return Promise.resolve();
}

async function slidePhoto() {
    await sliderComparison();

    modalPhotos.style.display = 'block';

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
