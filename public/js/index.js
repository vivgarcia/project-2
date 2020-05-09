$(document).ready(() => {


    function createProfile(username) {
        User.findAll({
            where: {
                username: username
            }
        }).then((res) => {
            let name = res.name;
            let email = res.email;
            let platform = res.platform;



            $('#userName').text("Name: " + name)
            $('#itememail').text("email: " + email);
            $('#itemPlatform').text("Platform: " + platform)

        })
    };

    let addNewGame = () => {
        event.preventDefault();

        let newGame = $('#newGame').val();
        console.log(newGame)
        addGame(newGame)

    };

    $('#addnewGame').on('click', addNewGame);

    let addGame = (gameData) => {
        $.post('/add-game', gameData)
    }

});