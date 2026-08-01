const avatarInput = document.getElementById('avatar-input');
const profilePicContainer = document.querySelector('.profile-pic');
const removeAvatarBtn = document.querySelector('.btn-remove');

// Default fallback SVG icon
const defaultSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
    </svg>
`;

// Preview image when user selects a file
if (avatarInput) {
    avatarInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicContainer.innerHTML = `<img src="${e.target.result}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Reset image back to default SVG
if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener('click', function() {
        profilePicContainer.innerHTML = defaultSvg;
        if (avatarInput) avatarInput.value = ''; // Reset file input
    });
}