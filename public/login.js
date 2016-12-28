function main() {
    
    // Log in.
    $('#login-form').on('submit', (ev) => {
        ev.preventDefault()
        
        $.ajax({
            type: "POST",
            url: "/login",
            data: {
                username: $('input[name=username]').val(),
                password: $('input[name=password]').val(),
            },
            dataType: "json",
            success: (results) => {
                if (results.status === 'OK')
                    window.location.replace('/')
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(textStatus)
                $('#login-button').notify(
                    "Error: Incorrect username or password.",
                    {
                        position: 'right',
                        className: 'error'
                    }
                )
            }
        })
    })
}

$(document).ready(main)
