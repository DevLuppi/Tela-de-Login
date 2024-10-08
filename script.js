$(document).ready(function() {
    const backendUrl = 'http://localhost:5000'; 

    document.getElementById('email-button').addEventListener('click', async function() {
        const email = document.getElementById('email').value;
        if (!email) {
            document.getElementById('alert-error').innerText = 'Por favor, insira um email.';
            document.getElementById('alert-error').style.display = 'block';
            return;
        }

        document.getElementById('alert-error').style.display = 'none';
        document.getElementById('alert-info').style.display = 'block';

        const emailButton = document.getElementById('email-button');
        emailButton.style.display = 'none';

        const loadingCircle = document.createElement('div');
        loadingCircle.classList.add('loading-button');
        emailButton.parentNode.appendChild(loadingCircle);

        const response = await fetch(`${backendUrl}/send_pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            const data = await response.json();
            const emailFormContent = document.getElementById('email-form-content');
            const pinFormContent = document.getElementById('pin-form-content');

            emailFormContent.classList.add('slide-out');

            setTimeout(() => {
                document.getElementById('alert-info').style.display = 'none';
                emailFormContent.classList.add('hidden');
                emailFormContent.classList.remove('slide-out');
                pinFormContent.classList.remove('hidden');
                pinFormContent.classList.add('slide-in');
                loadingCircle.remove();
                emailButton.style.display = 'block';
            }, 500);  
        } else {
            const errorData = await response.json();
            document.getElementById('alert-error').innerText = errorData.error;
            document.getElementById('alert-error').style.display = 'block';
            loadingCircle.remove();
            emailButton.style.display = 'block';
        }
    });

    document.getElementById('pin-button').addEventListener('click', async function() {
        const email = document.getElementById('email').value;
        const pin = document.getElementById('pin').value;
        if (!email || !pin) {
            document.getElementById('alert-error').innerText = 'Por favor, insira o PIN.';
            document.getElementById('alert-error').style.display = 'block';
            return; 

        }

        document.getElementById('alert-error').style.display = 'none';

        const pinButton = document.getElementById('pin-button');
        pinButton.style.display = 'none';

        const loadingCircle = document.createElement('div');
        loadingCircle.classList.add('loading-button');
        pinButton.parentNode.appendChild(loadingCircle);

        const response = await fetch(`${backendUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pin })
        });

        if (response.ok) {
            const data = await response.json();
            setTimeout(() => {
                loadingCircle.classList.remove('loading-button');
                loadingCircle.classList.add('validated-button');
                loadingCircle.style.border = 'none';
                setTimeout(() => {
                    window.location.href = 'paginainicial.html';
                }, 500);  
            }, 1500);  
        } else {
            const errorData = await response.json();
            document.getElementById('alert-error').innerText = errorData.error;
            document.getElementById('alert-error').style.display = 'block';
            loadingCircle.remove();
            pinButton.style.display = 'block';
        }
    });
});