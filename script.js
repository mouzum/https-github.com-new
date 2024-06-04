const showMessage = (msg, type) => {
    let bgColor;
    switch (type) {
        case "error":
            bgColor = "linear-gradient(to right, #93291e, #ed213a)"
            break;
        case "success":
            bgColor = "linear-gradient(to right, #1D976C, #93F9B9)"
            break;
        case "default":
            bgColor = "000"
    }


    Toastify({
        text: msg,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: bgColor
        },
        onClick: function () { } // Callback after click
    }).showToast();

}

function handleSignup() {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    let user = { email, password, id: Math.random().toString(36).slice(2), date: new Date(), status: "incomplete" }


    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.find(user => user.email === email)

    // console.log(userExists)

    if (userExists) {
        showMessage('Username already exists. Please choose a different username.', 'error');
        return
    } else {
        users.push(user);
        window.location.assign("pages/login.html")
        localStorage.setItem('users', JSON.stringify(users));
        showMessage('Signup successful. You can now log in.', 'success');
    }
}

function handleLogin() {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.email === email);

    if (user && user.password === password) {
        window.location.assign("home.html")
    } else {
        showMessage('Username not found. Please sign up first.', 'error');
    }
}


// show table 
const showTable = () => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const tableStartingCode = `<div class="table-responsive"> <table class="table table-striped table-bordered table-hover text-center">
    `;
    const tableHead = `
        <thead class="thead-dark">
            <tr>
                <th>#</th>
                <th>Email</th>
                <th>Password</th>
                <th>Id</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
    `;
    const tableEndingCode = `
            </table>
        </div>
    `;

    let tableBody = "<tbody>";
    users.forEach((currElem, index) => {
        tableBody += `
            <tr>
                <td>${index + 1}</td>
                <td>${currElem.email}</td>
                <td>${currElem.password}</td>
                <td>${currElem.id}</td>
                <td>${currElem.status}</td>
                <td><button type="button" class="btn btn-sm me-2 btn-info"  data-value='${currElem.id}' onClick="userForUpdate(event)">Edit</button><button type="button" class="btn btn-sm btn-danger" data-value='${currElem.id}' onClick="handleDelete(event)">Delete</button></td>
                </tr>
        `;
    });
    tableBody += "</tbody>";

    const table = `${tableStartingCode}${tableHead}${tableBody}${tableEndingCode}`;
    document.getElementById("output").innerHTML = table;
};

// handle Delete 
const handleDelete = (event) => {
    let userId = event.target.getAttribute('data-value');

    const users = JSON.parse(localStorage.getItem('users'))
    console.log(userId)
    let usersAfterDelete = users.filter((user) => {
        return user.id !== userId
    })

    localStorage.setItem("users", JSON.stringify(usersAfterDelete))
    showMessage("User has been successfully deleted", "success");

    showTable()
}

const userForUpdate = (event) => {
    let userId = event.target.getAttribute("data-value")

    const users = JSON.parse(localStorage.getItem('users'))
    
    let user = users.find((user) => {
        return user.id === userId
    })
    
    let { email, password } = user
    
    console.log(user)
    
    document.getElementById("email").value = email
    document.getElementById("password").value = password
    
    localStorage.setItem("userForUpdate", JSON.stringify(user))

}

const handleUpdate = () =>{
    event.preventDefault()
    const users = JSON.parse(localStorage.getItem('users'))

    let userForEdit = JSON.parse(localStorage.getItem("userForEdit"));

    let updatedEmail = document.getElementById("email").value;
    let updatedPassword = document.getElementById("password").value;

    const updatedUser = { ...userForEdit, email: updatedEmail, password: updatedPassword };

    console.log(updatedUser)

    const updatedUsers = users.map((user) => {
        if (user.id === updatedUser.id) {
            return updatedUser;
        }
        return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    showMessage("User has been successfully updated", "success");

    showTable()
}


window.onload = () => {
    showTable()
}