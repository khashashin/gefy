document.addEventListener('DOMContentLoaded', main, false);

const body = document.querySelector('body');
const html = document.querySelector('html');

function main() {
    let container = document.querySelector('.container');

    fetch('assets/data-v2.json', {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then(data => {
        for (let i = 0; i < data.length; i++) {

            let card = `
                <div class="card" data-path="${data[i].path}" data-path-edited="${data[i].pathEdited}">
                    <div class="card-body">
                        <img src="${data[i].path}" alt="${data[i].data}">
                    </div>
                    <div class="card-footer">
                        <p>${data[i].data}</p>
                        <img class="icon" src="../assets/icons/info.svg">
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
    const cards = document.querySelectorAll('.card');
    
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', function() {
            const data = {
                path: this.getAttribute('data-path'),
                pathEdited: this.getAttribute('data-path-edited'),
            }

            openModal(data);

            const modal = document.querySelector('.modal');
            const closeIcon = modal.querySelector('.icon.close');
            const compareIcon = modal.querySelector('.icon.compare');
            const slideIcon = modal.querySelector('.icon.slide');
            closeIcon.addEventListener('click', closeModal);
            compareIcon.addEventListener('click', comparePhoto(data));
            slideIcon.addEventListener('click', slidePhoto(data));
        });
    }
}

function openModal(data) {

    body.style.overflowX = 'hidden';
    body.style.overflowY = 'auto';
    html.style.overflowX = 'hidden';
    html.style.overflowY = 'auto';

    const modal = document.querySelector('.modal');
    const img = document.createElement('img');
    const imgEdited = document.createElement('img');
    img.classList.add('photo');
    imgEdited.classList.add('photo');

    if (modal) {
        img.src = data.path;
        imgEdited.src = data.pathEdited;
        modal.querySelector('.modal-body').appendChild(img);
        modal.querySelector('.modal-body').appendChild(imgEdited);
        modal.style.display = 'block';
    }
}

function closeModal() {

    body.style.overflowX = 'auto';
    body.style.overflowY = 'auto';
    html.style.overflowX = 'auto';
    html.style.overflowY = 'auto';

    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
        modal.querySelectorAll('.photo')
            .forEach(photo => {
                photo.remove();
            }
        );
    }
}

function comparePhoto(data) {
    
}

function slidePhoto(data) {
    
}
