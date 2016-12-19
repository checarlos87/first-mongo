function main() {
    $('#register-form').on('submit', (ev) => {
        ev.preventDefault()
        $.ajax({
            type: "POST",
            url: "/api/pokemon",
            data: {
                species: $('input[name=species]').val(),
                dex: $('input[name=dex-num]').val(),
                type1: $('input[name=type-1]').val(),
                type2: $('input[name=type-2]').val(),
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

                else if (results.status === 'duplicate') {
                    $('#register-button').notify(
                        "Error: Pokémon already registered.",
                        {
                            position: 'bottom',
                            className: 'error'
                        }
                    )

                    $('#register-form')[0].reset()
                }

            }
        })
    })
}

$(document).ready(main)
