function main() {
    $('#register-form').on('submit', (ev) => {
        ev.preventDefault()
        $.ajax({
            type: "POST",
            url: "/pokemon",
            data: {
                species: $('input[name=species]').val(),
                level: $('input[name=level]').val(),
                hp: $('input[name=hp]').val(),
                atk: $('input[name=atk]').val(),
                def: $('input[name=def]').val(),
                spa: $('input[name=spa]').val(),
                spd: $('input[name=spd]').val(),
                spe: $('input[name=spe]').val(),
            },
            dataType: "json",
            success: (results) => {
                if (results.status === 'OK')
                    $('#register-button').notify(
                        "Pokémon registered successfully!",
                        {
                            position: 'bottom',
                            className: 'success'
                        }
                    )
            }
        })
    })
}

$(document).ready(main)
