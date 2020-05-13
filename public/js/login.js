let handleCreateAccount = () => {
    event.preventDefault();

    let username = $('#createUsername').val().trim();
    let name = $('#name').val().trim();
    let password = $('#createPassword').val();
    let email = $('#email').val().trim();
    let platform = $('#platform').val();

    addUser({
        username: username,
        name: name,
        password: password,
        email: email,
        platform: platform
    });


}

let addUser = (userData) => {
    $.post('/create-account', userData);
}

$('#createAccount').on('click', handleCreateAccount);