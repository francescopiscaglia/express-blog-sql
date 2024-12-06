const ulEl = document.querySelector(".container ul");

fetch("http://localhost:3001/posts/list")
    .then(response => response.json())
    .then(data => {
        const posts = data.data;

        posts.forEach(post => {
            const { title, slug, content, image, tags } = post;

            const markup = `
                <li>
                    <img src="${image}" alt="">
                    <h3>${title}</h3>
                    <p>${content}</p>
                    <p>${slug}</p>
                    <p>${tags}</p>
                </li>
            `;

            ulEl.innerHTML += markup
            
        });
        
        
    })
    .catch(error => console.error(error))
