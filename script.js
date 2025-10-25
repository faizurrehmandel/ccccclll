// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const copyBtn = document.getElementById('copyBtn');
const blogTitle = document.getElementById('blogTitle');
const blogBody = document.getElementById('blogBody');
const savedBlogs = document.getElementById('savedBlogs');
const notification = document.getElementById('notification');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

// Blog Generation Data
const titles = [
    'The Future of Technology',
    'Sustainable Living Tips',
    'Digital Transformation',
    'Mindfulness in Modern Life',
    'Innovation Trends'
];

const paragraphs = [
    'In today\'s rapidly evolving world...',
    'The importance of sustainable practices...',
    'As we navigate through digital transformation...',
    'Understanding the impact of technology...',
    'Innovation continues to shape our future...'
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSavedBlogs();
    setupEventListeners();
});

function setupEventListeners() {
    generateBtn.addEventListener('click', generateBlog);
    saveBtn.addEventListener('click', saveBlog);
    copyBtn.addEventListener('click', copyBlog);
    mobileMenu.addEventListener('click', toggleMobileMenu);

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth' });
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
}

// Blog Generation
function generateBlog() {
    try {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomParagraphs = generateRandomParagraphs();

        blogTitle.textContent = randomTitle;
        blogBody.innerHTML = randomParagraphs;

        showNotification('Blog generated successfully!');
    } catch (error) {
        console.error('Error generating blog:', error);
        showNotification('Error generating blog. Please try again.', 'error');
    }
}

function generateRandomParagraphs() {
    const numParagraphs = Math.floor(Math.random() * 3) + 2;
    let content = '';
    
    for (let i = 0; i < numParagraphs; i++) {
        const paragraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        content += `<p>${paragraph}</p>`;
    }
    
    return content;
}

// Blog Management
function saveBlog() {
    try {
        if (!blogTitle.textContent) {
            throw new Error('No blog to save');
        }

        const blog = {
            id: Date.now(),
            title: blogTitle.textContent,
            content: blogBody.innerHTML,
            date: new Date().toLocaleDateString()
        };

        const savedBlogs = getSavedBlogs();
        savedBlogs.push(blog);
        localStorage.setItem('blogs', JSON.stringify(savedBlogs));

        displaySavedBlogs();
        showNotification('Blog saved successfully!');
    } catch (error) {
        console.error('Error saving blog:', error);
        showNotification('Error saving blog. Please try again.', 'error');
    }
}

function copyBlog() {
    try {
        const content = `${blogTitle.textContent}\n\n${blogBody.textContent}`;
        navigator.clipboard.writeText(content)
            .then(() => showNotification('Blog copied to clipboard!'))
            .catch(err => {
                console.error('Error copying to clipboard:', err);
                showNotification('Error copying to clipboard', 'error');
            });
    } catch (error) {
        console.error('Error copying blog:', error);
        showNotification('Error copying blog. Please try again.', 'error');
    }
}

// Saved Blogs Management
function getSavedBlogs() {
    try {
        const blogs = localStorage.getItem('blogs');
        return blogs ? JSON.parse(blogs) : [];
    } catch (error) {
        console.error('Error getting saved blogs:', error);
        return [];
    }
}

function loadSavedBlogs() {
    displaySavedBlogs();
}

function displaySavedBlogs() {
    try {
        const blogs = getSavedBlogs();
        savedBlogs.innerHTML = '';

        blogs.forEach(blog => {
            const blogElement = createBlogElement(blog);
            savedBlogs.appendChild(blogElement);
        });
    } catch (error) {
        console.error('Error displaying saved blogs:', error);
        showNotification('Error loading saved blogs', 'error');
    }
}

function createBlogElement(blog) {
    const element = document.createElement('div');
    element.className = 'saved-blog';
    element.innerHTML = `
        <h3>${blog.title}</h3>
        <div class="blog-date">${blog.date}</div>
        <div class="blog-preview">${blog.content}</div>
        <button onclick="deleteBlog(${blog.id})" class="action-button">Delete</button>
    `;
    return element;
}

function deleteBlog(id) {
    try {
        let blogs = getSavedBlogs();
        blogs = blogs.filter(blog => blog.id !== id);
        localStorage.setItem('blogs', JSON.stringify(blogs));
        displaySavedBlogs();
        showNotification('Blog deleted successfully!');
    } catch (error) {
        console.error('Error deleting blog:', error);
        showNotification('Error deleting blog', 'error');
    }
}

// UI Utilities
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    const spans = mobileMenu.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
}
