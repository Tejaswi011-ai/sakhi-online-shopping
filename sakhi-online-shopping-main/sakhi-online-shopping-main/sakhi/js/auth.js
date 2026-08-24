// js/auth.js

if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const users = JSON.parse(localStorage.getItem('users')) || {};
        
        if (users[email]) {
            alert("Login Successful! Welcome back.");
            localStorage.setItem('currentUser', email);
            window.location.href = "index.html";
        } else {
            alert("Account not found. Please sign up.");
        }
    });
}

if (document.getElementById('signup-form')) {
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[email]) {
            alert("Account already exists with this email.");
        } else {
            users[email] = { name: name, password: password };
            localStorage.setItem('users', JSON.stringify(users));
            alert("Account Created Successfully! Please login.");
            document.getElementById('signup-form').reset();
            if (typeof toggleAuth === 'function') toggleAuth('login');
        }
    });
}
