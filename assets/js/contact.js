document.addEventListener('DOMContentLoaded', () => {
    // Check if the form exists on the page
    const form = document.getElementById('oracleForm');
    
    // Check for success query parameter after Formspree redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        const statusElement = document.getElementById('form-status');
        if(statusElement) {
            statusElement.style.display = 'block';
            statusElement.textContent = "The Oracle has received your query. Check your sacred email for confirmation!";
            // Remove success param from URL after a moment for a cleaner look
            setTimeout(() => {
                history.replaceState(null, '', location.pathname);
            }, 5000);
        }
    }
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const statusElement = document.getElementById('form-status');
            
            // --- CRUCIAL MANUAL STEP ---
            // 1. SIGN UP FOR FORMSPREE.IO (free tier)
            // 2. CREATE A NEW FORM to get the endpoint URL.
            // 3. REPLACE THIS ENTIRE STRING WITH YOUR FORMSPREE ENDPOINT URL
            const FORMSPREE_ENDPOINT = "YOUR_FORMSPREE_ENDPOINT_HERE";
            
            if (FORMSPREE_ENDPOINT === "YOUR_FORMSPREE_ENDPOINT_HERE") {
                alert("FORM ERROR: You must replace 'YOUR_FORMSPREE_ENDPOINT_HERE' in assets/js/contact.js with your actual Formspree endpoint URL for submissions to work!");
                return;
            }
            
            statusElement.textContent = "The Oracle is consulting the stars...";
            statusElement.style.display = 'block';

            const data = new FormData(e.target);
            
            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success is now handled by the redirect parameter in oracle.html
                    // We submit, Formspree handles the confirmation email, and redirects back to our page.
                    // If you connect the endpoint correctly, this entire block won't run, as the form handles the redirect!
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (responseData.errors) {
                        statusElement.textContent = `Error: ${responseData.errors.map(error => error.message).join(", ")}`;
                    } else {
                        statusElement.textContent = "Submission Failed. Please try again.";
                    }
                }
            } catch (error) {
                statusElement.textContent = "An unknown error occurred. Please check your network connection.";
            }
        });
    }
});
Added JS for Formspree submission
