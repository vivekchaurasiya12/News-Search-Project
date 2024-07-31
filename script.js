const apikey = "2d33dd4aea8d4dd5bbb52d9e0d70ddae";

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

async function fetchRandomNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?sources=bbc-news&pageSize=12&apiKey=${apikey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

// Listen for click events on the search button
searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query); // Pass the query to the function
            displayBlogs(articles);
        } catch (error) {
            console.error("Error fetching news by query", error);
        }
    }
});

// Fetch news articles based on a search query
async function fetchNewsQuery(query) { // Accept the query parameter
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=12&apiKey=${apikey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching news by query", error);
        return [];
    }
}

function displayBlogs(articles) {
    blogContainer.innerHTML = "";

    const defaultImages = [
        'news.jpg',
        'news1.jpg',
        'news2.jpg',
        'news3.jpg',
        'news4.jpg'
    ];

    let defaultImageIndex = 0;

    articles.forEach((article) => {
        const blogCard = document.createElement('div');
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        if (article.urlToImage) {
            img.src = article.urlToImage;
        } else {
            img.src = defaultImages[defaultImageIndex];
            // Cycle through the default images
            defaultImageIndex = (defaultImageIndex + 1) % defaultImages.length;
        }
        img.alt = article.title || "No Image Available";

        const title = document.createElement("h2");
        const truncatedTitle = article.title && article.title.length > 30
            ? article.title.slice(0, 30) + "..."
            : article.title || "No Title Available";
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDescription = article.description && article.description.length > 100
            ? article.description.slice(0, 100) + "..."
            : article.description || "No description Available";
        description.textContent = truncatedDescription;

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);
        blogCard.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });
        blogContainer.appendChild(blogCard);
    });
}

(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching random news", error);
    }
})();
