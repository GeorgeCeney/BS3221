const apiURL = "https://3y0arl9udf.execute-api.eu-west-2.amazonaws.com/test";
let currentOwnerId = null;
let currentOwnerForm = 'owner-login';

function showForm(type) {
    document.getElementById('role-selection').style.display = 'none';

    if (type === 'owner') {
        document.getElementById('owner-forms').style.display = 'block';
    } else if (type === 'walker') {
        document.getElementById('walker-forms').style.display = 'block';
    }
    document.getElementById('home-button').style.display = 'block';
}

function registerOwner() {
    const name = document.querySelector('#owner-register input[name="name"]').value;
    const email = document.querySelector('#owner-register input[name="email"]').value;

    fetch(`${apiURL}/owners`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email
        })
    }).then(response => response.json()).then(data => {
        console.log(data);
        this.clearInputs();
    }).catch(error => {
        console.error("Error:", error);
    });
}

function loginOwner() {
    const email = document.querySelector('#owner-login input[name="email"]').value;
    fetch(`${apiURL}/owners/${email}`) 
        .then(response => {
            if (!response.ok) {
                throw new Error("Invalid email or server error");
            }
            return response.json();
        }).then(owner => {
            currentOwnerId = owner.ownerID
            // displayPetsTable(currentOwnerId);
            displayWalkersTable();
            document.getElementById('owner-forms').style.display = 'none';
            document.getElementById('owner-info-section').style.display = 'block';
            this.clearInputs();
        }).catch(error => {
            console.error("Error:", error);
        });
}

function registerWalker() {
    const name = document.querySelector('#walker-register input[name="name"]').value;
    const number = document.querySelector('#walker-register input[name="number"]').value;
    const availability = document.querySelector('#walker-register input[name="availability"]').value;

    fetch(`${apiURL}/walkers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            number: number,
            availability: availability
        })
    }).then(response => response.json()).then(data => {
        console.log(data);
        this.clearInputs();
    }).catch(error => {
        console.error("Error:", error);
    });
}

function goHome() {
    currentOwnerId = null;
    document.getElementById('owner-forms').style.display = 'none';
    document.getElementById('walker-forms').style.display = 'none';
    document.getElementById('role-selection').style.display = 'block';
    document.getElementById('home-button').style.display = 'none';
    document.getElementById('owner-info-section').style.display = 'none';
    this.clearInputs();
}

function displayWalkersTable() {
    fetch(`${apiURL}/walkers`)
        .then(response => response.json())
        .then(walkers => {
            // Populate the walkers table with an option to assign a pet
            const walkersTable = document.getElementById('walkers-table');
            walkersTable.innerHTML = '<tr><th>Name</th><th>Contact Number</th><th>Availability</th></tr>' +
                walkers.map(walker => `
                    <tr>
                        <td>${walker.name}</td>
                        <td>${walker.number}</td>
                        <td>${walker.availability}</td>
                    </tr>`).join('');
        })
        .catch(err => {
            alert('Error fetching walkers. Please try again later.');
        });
}

function clearInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
    input.value = "";
});
}

function showLoginForm() {
    document.getElementById('owner-login').classList.remove('hidden');
    document.getElementById('owner-register').classList.add('hidden');
    document.getElementById('toggleFormButton').textContent = 'Register';
}

function showRegisterForm() {
    document.getElementById('owner-register').classList.remove('hidden');
    document.getElementById('owner-login').classList.add('hidden');
    document.getElementById('toggleFormButton').textContent = 'Login';
}

function switchForms() {
    if (document.getElementById('owner-login').classList.contains('hidden')) {
        showLoginForm();
    } else {
        showRegisterForm();
    }
}

