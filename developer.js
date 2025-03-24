// Developer popup functionality
function showDeveloperInfo() {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.id = 'developerPopup';
    popup.innerHTML = `
        <div class="popup-container">
            <div class="popup-icon">
                <i class="fas fa-laptop-code"></i>
            </div>
            <h2 class="popup-title">Developer Information</h2>
            <div class="popup-message">
                <p><strong>Developer:</strong>&nbspSagar Chudasama</p>
                <p><strong>Role:</strong>&nbspCSE Student</p>
                <p><strong>Email:</strong> sagar20112007@gmail.com</p>
            </div>
            <button class="popup-close" id="closeDeveloperPopup">Close</button>
        </div>
    `;

    document.body.appendChild(popup);

    // Add animation class after a small delay
    setTimeout(() => {
        popup.classList.add('active');
    }, 10);

    // Close popup functionality
    const closePopup = () => {
        popup.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300); // Match the CSS transition duration
    };

    // Close on button click
    document.getElementById('closeDeveloperPopup').onclick = closePopup;

    // Close on outside click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
}

// Initialize developer popup trigger
document.addEventListener('DOMContentLoaded', () => {
    const developerLink = document.querySelector('a[href="#"] i.fa-laptop-code').parentElement;
    developerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showDeveloperInfo();
    });
});