document.addEventListener('DOMContentLoaded', function() {
    initialize();

    function initialize() {
        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const target = event.target.getAttribute('href');
                window.location.href = target;
            });
        });
    }


    function sendHttpRequest(method, url, data) {
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send request.');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
    }
});