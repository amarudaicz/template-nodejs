import { Admin } from "../interface/admin"

export const resetPasswordTemplate = (user:Admin, token:string) => {
   return {
    html:`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecimiento de Contraseña</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                color: #40507a;
            }
    
            p {
                font-size: 14px;
                line-height: 1.5;
                color: #333333;
            }
    
            a{
                color:none;
            }

            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #40507a;
                color: #ffffff;
                font-size: 16px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
    
            .btn:hover {
                background-color: #314169;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <h1>Restablecimiento de Contraseña</h1>
            <p>Hola, ${user.username}</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, puedes ignorar este correo electrónico.</p>
            <p>Si deseas restablecer tu contraseña, haz clic en el siguiente botón:</p>
            <a style:color:#fff; href="http://localhost:4200/#/login/reset_password?token=${token}" class="btn">Restablecer Contraseña</a>
            <p>Si tienes algún problema con el botón, también puedes copiar y pegar el siguiente enlace en tu navegador:</p>
            <p>http://localhost:4200/#/login/reset_password?token=${token}</p>

           <p> DELI nunca enviará un correo electrónico en el que solicite que se revele o verifique una contraseña, una tarjeta de crédito o un número de cuenta bancaria. Si recibe un correo electrónico sospechoso con un enlace para actualizar la información de la cuenta, no haga clic en el enlace. En su lugar, reporte el correo electrónico a Deli para que se investigue. </p>

            <p>Gracias,</p>
            <p>El equipo de DELI</p>
        </div>
    </body>
    
    </html>
    `,
    subject:'Restablecer contraseña',
    text:'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa'
   }

}

