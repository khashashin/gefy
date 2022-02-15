document.addEventListener('DOMContentLoaded', main, false);

function main() {
    let tbody = document.querySelector('tbody');


    fetch('assets/data.json', {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        const dataY = data.y;
        const dataF = data.f;
        const dataE = data.e;

        // Yusuf
        for (let i = 0; i < dataY.length; i++) {
            let tr = document.createElement('tr');
            let tdData = document.createElement('td');
            let tdImage = document.createElement('td');
            tdImage.classList.add('image');

            tdData.innerHTML = dataY[i].data;

            let img = document.createElement('img');
            img.src = dataY[i].path;
            tdImage.appendChild(img);
            tr.appendChild(tdData);
            tr.appendChild(tdImage);
            tbody.appendChild(tr);
        }

        // Franz
        for (let i = 0; i < dataF.length; i++) {
            let tr = document.createElement('tr');
            let tdData = document.createElement('td');
            let tdImage = document.createElement('td');
            tdImage.classList.add('image');

            tdData.innerHTML = dataF[i].data;

            let img = document.createElement('img');
            img.src = dataF[i].path;
            tdImage.appendChild(img);
            tr.appendChild(tdData);
            tr.appendChild(tdImage);
            tbody.appendChild(tr);
        }

        // Eleasar
        for (let i = 0; i < dataE.length; i++) {
            let tr = document.createElement('tr');
            let tdData = document.createElement('td');
            let tdImage = document.createElement('td');
            tdImage.classList.add('image');

            tdData.innerHTML = dataE[i].data;

            let img = document.createElement('img');
            img.src = dataE[i].path;
            tdImage.appendChild(img);
            tr.appendChild(tdData);
            tr.appendChild(tdImage);
            tbody.appendChild(tr);
        }
    }).catch(error => {
        console.log(error);
    });
}
