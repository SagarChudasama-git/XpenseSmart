// Loader management
document.addEventListener('DOMContentLoaded', function() {
    // Create loader container
    const loaderContainer = document.createElement('div');
    loaderContainer.id = 'loader-container';
    loaderContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    // Add the dot spinner HTML
    loaderContainer.innerHTML = `
        <div class="dot-spinner">
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
        </div>
    `;

    // Add to document
    document.body.appendChild(loaderContainer);

    // Track animation cycles
    let halfCycleComplete = false;
    const middleDot = loaderContainer.querySelector('.dot-spinner__dot:nth-child(4)');
    
    // Function to handle animation end
    const handleAnimationIteration = () => {
        halfCycleComplete = true;
        if (document.readyState === 'complete') {
            hideLoader();
        }
    };

    // Add animation iteration listener to the middle dot
    middleDot.addEventListener('animationiteration', handleAnimationIteration);

    // Hide loader when page is loaded and half animation cycle is complete
    window.addEventListener('load', function() {
        if (halfCycleComplete) {
            hideLoader();
        }
    });
});

// Function to show loader
function showLoader() {
    const loader = document.getElementById('loader-container');
    if (loader) {
        loader.style.display = 'flex';
        loader.style.opacity = '1';
    }
}

// Function to hide loader
function hideLoader() {
    const loader = document.getElementById('loader-container');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
}
