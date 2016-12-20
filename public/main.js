function main() {
    
    $('#search-box').on('submit', (ev) => {
        if (!$('input[name=pokemon]').val())
            ev.preventDefault()
    })

    $('#register-form').on('submit', (ev) => {
        ev.preventDefault()

        if (!$('input[name=species]').val()) {
            $('input[name=species]').notify(
                "You must specify a Pokémon species.",
                {
                    position: 'right',
                    className: 'error'
                }
            )
            return
        }

        $.ajax({
            type: "POST",
            url: "/api/pokemon",
            data: {
                species: $('input[name=species]').val(),
                type1: $('select[name=type-1]').val(),
                type2: $('select[name=type-2]').val(),
                hp: $('input[name=hp]').val(),
                atk: $('input[name=atk]').val(),
                def: $('input[name=def]').val(),
                spa: $('input[name=spa]').val(),
                spd: $('input[name=spd]').val(),
                spe: $('input[name=spe]').val(),
            },
            dataType: "json",
            success: (results) => {
                if (results.status === 'OK') {
                    $('#register-button').notify(
                        "Pokémon registered successfully!",
                        {
                            position: 'bottom',
                            className: 'success'
                        }
                    )

                    $('#register-form')[0].reset()
                }

                else if (results.status === 'error') {

                    if (results.message === 'empty key') {
                        $('#register-button').notify(
                            "All fields are required.",
                            {
                                position: 'bottom',
                                className: 'error'
                            }
                        )
                    }
        
                    else if (results.message === 'duplicate') {
                        $('#register-button').notify(
                            "Error: Pokémon is already registered.",
                            {
                                position: 'bottom',
                                className: 'error'
                            }
                        )
    
                        $('#register-form')[0].reset()
                    }

                }
            }
        })
    }) // Pokémon register form.

    $('#delete-button').on('click', (ev) => {
        ev.preventDefault()
        var answer = confirm('Do you really want to delete this Pokémon?')
        if (answer) {

            $.ajax({
                type: "POST",
                url: $('#delete-button').attr('href'),
                dataType: "json",
                success: (results) => {
                    alert('The Pokémon has been deleted successfully.')
                    window.location.replace('/')
                }
            })
        }

    })
}

$(document).ready(main)
