document.addEventListener('DOMContentLoaded', function () {
    const catLink = document.getElementById('categories-link');
    const catDropdown = document.getElementById('categories-dropdown');
    let dropdownTimeout;

    if (catLink && catDropdown) {
        catLink.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
            catDropdown.style.display = 'block';
        });
        catDropdown.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
            catDropdown.style.display = 'block';
        });

        catLink.addEventListener('mouseleave', () => {
            dropdownTimeout = setTimeout(() => {
                catDropdown.style.display = 'none';
            }, 200);
        });
        catDropdown.addEventListener('mouseleave', () => {
            dropdownTimeout = setTimeout(() => {
                catDropdown.style.display = 'none';
            }, 200);
        });
    }
});

