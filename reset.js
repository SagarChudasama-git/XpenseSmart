function showResetConfirmation() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        ">
            <h2 style="color: #ff4444; margin-bottom: 15px;">Reset All Data?</h2>
            <p style="color: #666; margin-bottom: 20px;">This action cannot be undone. All your transactions, salary information, and settings will be deleted.</p>
            <div class="modal-buttons" style="display: flex; justify-content: center; gap: 10px;">
                <button class="confirm-reset" onclick="resetAllData()" style="
                    padding: 10px 20px;
                    background-color: #ff4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Yes, Reset Everything</button>
                <button class="cancel-reset" onclick="closeModal()" style="
                    padding: 10px 20px;
                    background-color: #666;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function resetAllData() {
    // Clear all localStorage data
    localStorage.clear();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 15px 30px;
        border-radius: 4px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    `;
    notification.textContent = 'All data has been reset successfully!';
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds and redirect
    setTimeout(() => {
        notification.remove();
        // Get the current URL path
        const currentPath = window.location.pathname;
        
        // Determine if we're on GitHub Pages
        const isGitHubPages = currentPath.includes('/XpenseSmart/');
        
        // Determine if we're in a subdirectory
        const isInSubDirectory = currentPath.includes('/html/');
        
        // Construct the redirect URL
        let redirectUrl;
        if (isGitHubPages) {
            redirectUrl = '/XpenseSmart/index.html';
        } else {
            redirectUrl = isInSubDirectory ? '../index.html' : 'index.html';
        }
        
        // Redirect to the appropriate URL
        window.location.href = redirectUrl;
    }, 3000);
    
    closeModal();
}

// Add event listener to reset button
document.addEventListener('DOMContentLoaded', () => {
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', showResetConfirmation);
    }
});