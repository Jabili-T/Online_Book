document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initializeApp();
});

function initializeApp() {
    // Show loading animation and then hide it
    setTimeout(() => {
        const loadingContainer = document.getElementById('loadingContainer');
        const mainContent = document.querySelector('.main-content');
        
        if (loadingContainer) loadingContainer.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
    }, 2000);
    
    // Initialize featured books
    populateFeaturedBooks();
    
    // Initialize search functionality
    initializeSearch();
    
    // Update user UI based on login status
    updateUserUI();
}

// Populate Featured Books
function populateFeaturedBooks() {
    const featuredBooks = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, image: 'images/great-gatsby.jpeg' },
        { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.99, image: 'images/mockingbird.jpeg' },
        { id: 3, title: '1984', author: 'George Orwell', price: 11.99, image: 'images/1984.jpeg' },
        { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', price: 9.99, image: 'images/pride-prejudice.jpeg' },
        { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 19.99, image: 'images/hobbit.jpeg' },
        { id: 6, title: 'Harry Potter', author: 'J.K. Rowling', price: 24.99, image: 'images/harry-potter.jpeg' }
    ];

   const featuredContainer = document.querySelector('.book-grid.featured-books'); 
    if (featuredContainer) {
        featuredBooks.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-card';
            bookElement.innerHTML = `
                <img src="${book.image}" alt="${book.title}" onerror="this.src='images/placeholder-book.jpg'">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="author">by ${book.author}</p>
                    <p class="price">$${book.price.toFixed(2)}</p>
                    <button onclick="addToCart(${book.id}, '${book.title}', '${book.author}', ${book.price}, '${book.image}')">Add to Cart</button>
                </div>
            `;
            featuredContainer.appendChild(bookElement);
        });
    } else {
        console.error('Featured books container not found');
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const bookCards = document.querySelectorAll('.book-card');
            
            bookCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const author = card.querySelector('.author')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Shopping Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(bookId, title, author, price, image) {
    // Check if cart exists in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if book is already in cart
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: bookId,
            title: title || 'Unknown Book',
            author: author || 'Unknown Author',
            price: price || 0,
            image: image || 'images/placeholder-book.jpg',
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Book added to cart!');
}

// User Authentication Functions
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.style.display = 'block';
}

function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.style.display = 'none';
}

function showRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) registerModal.style.display = 'block';
}

function closeRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) registerModal.style.display = 'none';
}

function showSuccessMessage(title, message, subMessage) {
    const successContent = document.getElementById('successContent');
    if (successContent) {
        successContent.innerHTML = `
            <i class="fas fa-check-circle" style="color: #28a745; font-size: 48px; margin-bottom: 15px;"></i>
            <h3 style="color: #28a745; margin-bottom: 15px;">${title}</h3>
            <p style="margin-bottom: 10px;">${message}</p>
            <p style="color: #666;">${subMessage}</p>
        `;
        const successMessage = document.getElementById('successMessage');
        if (successMessage) successMessage.style.display = 'block';
    }
}

function closeSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) successMessage.style.display = 'none';
}

function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName')?.value;
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        alert('Email already registered. Please login.');
        showLoginModal();
        closeRegisterModal();
        return;
    }
    
    // Add new user with their entered name
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration with their entered name
    localStorage.setItem('currentUser', JSON.stringify({ name, email }));
    
    // Close registration modal
    closeRegisterModal();
    
    // Show success message with their entered name
    showSuccessMessage(
        'Registration Successful!', 
        `Welcome, ${name}! You have successfully registered.`, 
        'You will be automatically logged in...'
    );
    
    // Update UI to show their name
    updateUserUI();
    
    // Close success message after 2 seconds
    setTimeout(() => {
        closeSuccessMessage();
    }, 2000);
}
    
function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Set current user with their actual name
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
        
        // Close login modal
        closeLoginModal();
        
        // Show success message with their actual name
        showSuccessMessage(
            'Login Successful!', 
            `Welcome back, ${user.name}!`, 
            'Enjoy your book shopping experience'
        );
        
        // Update UI immediately to show the user's name
        updateUserUI();
        
        // Close success message after 2 seconds but don't reload the page
        setTimeout(() => {
            closeSuccessMessage();
        }, 2000);
    } else {
        alert('Invalid email or password');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    updateUserUI();
    location.reload();
}

function updateUserUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const welcomeMessage = document.getElementById('welcomeMessage');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!welcomeMessage || !loginBtn || !registerBtn || !logoutBtn) {
        console.error('One or more UI elements not found');
        return;
    }
    
    if (currentUser) {
        welcomeMessage.textContent = `Welcome, ${currentUser.name}!`;
        welcomeMessage.style.display = 'inline';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline';
    } else {
        welcomeMessage.style.display = 'none';
        loginBtn.style.display = 'inline';
        registerBtn.style.display = 'inline';
        logoutBtn.style.display = 'none';
    }
}