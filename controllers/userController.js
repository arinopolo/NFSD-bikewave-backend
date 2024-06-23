const User = require("../models/userModel");
const Bicycle = require("../models/bicycleModel");
const Chat = require("../models/chatModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const myFrontend = process.env.FRONTEND;
const nodemailEmail = process.env.NODEMAILEMAIL;
const nodemailPas = process.env.NODEMAILPAS;

const nodemailer = require("nodemailer");

const mySecret = process.env.SECRET;

const userController = {
  //obtener la informacion de todos los usuarios

  getOneUser: async (req, res, next) => {
    try {
      const indexOfUserToBeConsulted = await User.findById(req.params.id);
      // cuando pongo un id aleatorio para que me ejecute el else no me lo ejecuto, me de el error de BSON...
      if (indexOfUserToBeConsulted) {
        res.status(200).json(indexOfUserToBeConsulted);
      } else {
        res
          .status(404)
          .json({ msg: `User with id ${userToBeConsulted} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },
  addUser: async (req, res, next) => {
    try {
      //encriptar la contraseña

      let userSalt = Math.random().toFixed(7);
      userSalt = Number(userSalt);
      const encryptedPassword = await bcrypt.hash(req.body.password, userSalt);

      const userToAdd = new User({
        ...req.body,
        password: encryptedPassword,
        salt: userSalt,
      });
      await userToAdd.save();

      res.status(200).json({
        msg: `User registered.`,
        success: true,
        userToAdd,
      });
    } catch (error) {
      next(error);
    }
  },

  sendWelcomeEmail: async (req, res) => {
    const user = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: nodemailEmail,
        pass: nodemailPas,
      },
    });

    try {
      const { info } = await transporter.sendMail({
        from: `"Bikewave" <${nodemailEmail}>`,
        to: user.email, // list of receivers
        subject: "Hola desde bikewave", // Subject line
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="es"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>Copy of (1) New Message</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
        <![endif]--><style type="text/css">.rollover:hover .rollover-first { max-height:0px!important; display:none!important; } .rollover:hover .rollover-second { max-height:none!important; display:block!important; } .rollover span { font-size:0px; } u + .body img ~ div div { display:none; } #outlook a { padding:0; } span.MsoHyperlink,span.MsoHyperlinkFollowed { color:inherit; mso-style-priority:99; } a.es-button { mso-style-priority:100!important; text-decoration:none!important; } a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; font-size:inherit!important; font-family:inherit!important; font-weight:inherit!important; line-height:inherit!important; } .es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0; mso-hide:all; } .es-button-border:hover > a.es-button { color:#ffffff!important; } td .es-button-border:hover a.es-button-3207 { color:#31B15C!important; }
         td .es-button-border:hover a.es-button-3875 { color:#31B15C!important; }@media only screen and (max-width:600px) {.es-m-p0r { padding-right:0px!important } .es-m-p25t { padding-top:25px!important } .es-m-p0l { padding-left:0px!important } .es-m-p20b { padding-bottom:20px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left }
         h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important }
         .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important }
         .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important }
         .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } .img-2644 { width:250px!important } .img-1842 { width:100px!important } }@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
         </head> <body class="body" style="width:100%;height:100%;padding:0;Margin:0"><div dir="ltr" class="es-wrapper-color" lang="es" style="background-color:#FAFAFA"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA"><tr>
        <td valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top"><tr><td align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr>
        <td align="left" bgcolor="#31B15C" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px;background-color:#31B15C"><table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr><td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:600px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://bikewave.es" style="mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:14px"><img src="https://fimamnj.stripocdn.email/content/guids/CABINET_865a81b758c9ab64c29f3a9f02ef6c07ec62b7feef162446ea6672a50283e393/images/group_2678.png" alt="Logo" style="display:block;font-size:12px;border:0;outline:none;text-decoration:none" title="Logo" class="img-1842" width="100"></a> </td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr>
        <td align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td class="es-m-p25t" align="left" bgcolor="#31B15C" style="Margin:0;padding-top:15px;padding-right:20px;padding-bottom:50px;padding-left:20px;background-color:#31B15C"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="left" style="padding:0;Margin:0;padding-top:10px"><h2 align="center" class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:26px;font-style:normal;font-weight:bold;line-height:31px;color:#ffffff">Bienvenid@ a bikewave, ${user.firstName}!</h2> </td></tr><tr><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0"><img src="https://fimamnj.stripocdn.email/content/guids/CABINET_865a81b758c9ab64c29f3a9f02ef6c07ec62b7feef162446ea6672a50283e393/images/biker_QG2.png" alt="" width="300" class="img-2644 adapt-img" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td></tr><tr>
        <td align="center" class="es-m-p0r es-m-p0l" style="padding:0;Margin:0;padding-bottom:10px;padding-right:40px;padding-left:40px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#ffffff;font-size:14px">​</p> <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#ffffff;font-size:14px">¡Qué emocionante tenerte con nosotros en nuestra comunidad ciclista! 😊</p></td></tr> <tr>
        <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#ffffff;border-width:0px;display:inline-block;border-radius:60px;width:auto"><a href="https://bikewave.es" class="es-button es-button-3207" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#31B15C;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#ffffff;border-radius:60px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:24px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #ffffff">DESCUBRIR BICIS</a></span></td></tr></table></td></tr></table></td></tr> <tr>
        <td align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:10px;padding-top:20px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" class="es-m-txt-l" style="padding:0;Margin:0;padding-bottom:10px"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:55px;color:#333333">¿Cómo funciona?</h1></td></tr></table></td></tr></table></td></tr> <tr>
        <td align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;padding-bottom:35px"> <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:90px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr><td class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;width:90px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="left" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px"><img src="https://fimamnj.stripocdn.email/content/guids/CABINET_865a81b758c9ab64c29f3a9f02ef6c07ec62b7feef162446ea6672a50283e393/images/1.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="65"></td> </tr></table></td></tr></table> <!--[if mso]></td><td style="width:30px"></td><td style="width:440px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr><td align="center" style="padding:0;Margin:0;width:440px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="left" class="es-m-txt-l" style="padding:0;Margin:0;padding-bottom:10px"><h3 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:bold;line-height:24px;color:#333333"><strong>Encuentra y elige tu bici</strong></h3></td></tr> <tr><td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Inicia sesión, busca bicicletas por categoría, guarda tus favoritas y selecciona la que más te guste.</p></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td></tr> <tr>
        <td class="es-m-p10t es-m-p10b" align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:35px;padding-top:35px"> <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:90px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr><td class="es-m-p20b" align="center" style="padding:0;Margin:0;width:90px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="right" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px"><img src="https://fimamnj.stripocdn.email/content/guids/CABINET_865a81b758c9ab64c29f3a9f02ef6c07ec62b7feef162446ea6672a50283e393/images/2.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="65"></td> </tr></table></td></tr></table> <!--[if mso]></td><td style="width:30px"></td><td style="width:440px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr><td class="es-m-p0r" align="center" style="padding:0;Margin:0;width:440px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="left" class="es-m-txt-l" style="padding:0;Margin:0;padding-bottom:10px"><h3 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:bold;line-height:24px;color:#333333"><strong>Contacta y pacta detalles</strong></h3></td></tr> <tr><td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Habla con el dueño, acuerda precios, fechas y lugar de recogida.</p></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td></tr> <tr><td class="es-m-p10t es-m-p10b" align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:35px;padding-top:35px"> <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr>
        <td style="width:90px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr><td align="left" style="padding:0;Margin:0;width:90px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0;font-size:0"><img src="https://fimamnj.stripocdn.email/content/guids/CABINET_865a81b758c9ab64c29f3a9f02ef6c07ec62b7feef162446ea6672a50283e393/images/3.png" alt="" width="65" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td></tr> </table></td></tr></table> <!--[if mso]></td><td style="width:30px"></td>
        <td style="width:440px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr><td align="center" style="padding:0;Margin:0;width:440px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" class="es-m-txt-l" style="padding:0;Margin:0;padding-bottom:10px"><h3 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:bold;line-height:24px;color:#333333">Reserva y paga</h3></td></tr> <tr>
        <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Reserva y paga el alquiler con el pago seguro. Recibirás una factura con el desglose del pago.</p></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td></tr> <tr><td class="es-m-p20b es-m-p10t" align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:35px;padding-top:35px"> <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:90px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr>
        <td class="es-m-p20b" align="center" style="padding:0;Margin:0;width:90px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="right" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px"><img src="https://fimamnj.stripocdn.email/content/guids/CABINET_865a81b758c9ab64c29f3a9f02ef6c07ec62b7feef162446ea6672a50283e393/images/4.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="65"></td> </tr></table></td></tr></table> <!--[if mso]></td><td style="width:30px"></td><td style="width:440px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr>
        <td class="es-m-p0r" align="center" style="padding:0;Margin:0;width:440px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" class="es-m-txt-l" style="padding:0;Margin:0;padding-bottom:10px"><h3 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:bold;line-height:24px;color:#333333">Recoge tu bici</h3></td></tr> <tr><td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Recoge la bici &nbsp;con el dueño o la dueña en el lugar pactado o en un establecimiento colaborador de la app.</p></td></tr></table></td></tr></table>
         <!--[if mso]></td></tr></table><![endif]--></td></tr> <tr><td class="es-m-p40t es-m-p40b" align="left" bgcolor="#31B15C" style="Margin:0;padding-top:30px;padding-right:25px;padding-bottom:30px;padding-left:25px;background-color:#31B15C"><table cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0;width:550px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="left" style="padding:0;Margin:0"><p align="center" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#ffffff;font-size:14px">Prepárate para vivir aventuras sobre dos ruedas y descubrir nuevas rutas junto a otros apasionados del ciclismo como tú.</p> <p align="center" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#ffffff;font-size:14px">​</p><p align="center" style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#ffffff;font-size:14px">En nuestra app, <strong>encontrarás bicis listas para rodar y una comunidad lista para explorar.</strong> Si tienes alguna duda o solo quieres charlar sobre ciclismo, ¡aquí estamos para ayudarte!</p></td></tr> <tr>
        <td align="center" style="padding:0;Margin:0;padding-bottom:20px;padding-top:20px"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#ffffff;border-width:0px;display:inline-block;border-radius:60px;width:auto"><a href="https://bikewave.es" class="es-button es-button-3875" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#31B15C;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#ffffff;border-radius:60px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:24px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #ffffff">DESCUBRIR BICIS</a></span></td></tr></table></td></tr></table></td></tr></table></td></tr></table>
         <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top"><tr><td align="center" style="padding:0;Margin:0"><table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" role="none"><tr><td align="left" style="Margin:0;padding-bottom:20px;padding-right:20px;padding-left:20px;padding-top:20px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="left" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0"><table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="center" valign="top" class="es-m-p0r" style="padding:0;Margin:0;padding-right:40px"><a target="_blank" href="https://www.instagram.com/itsbikewave?igsh=cXoyNGZ6N3JzaTFn" style="mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img title="Instagram" src="https://fimamnj.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" height="30" width="30" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a> </td>
        <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://www.tiktok.com/@itsbikewave?_t=8nRHC9EE5HV&_r=1" style="mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img title="TikTok" src="https://fimamnj.stripocdn.email/content/assets/img/social-icons/logo-black/tiktok-logo-black.png" alt="Tt" height="30" width="30" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a></td></tr></table></td></tr><tr><td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">Bikewave © 2024&nbsp;</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table>
         <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr><td class="es-info-area" align="center" style="padding:0;Margin:0"><table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF" role="none"><tr><td align="left" style="padding:20px;Margin:0"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
        <td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" class="es-infoblock" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#CCCCCC;font-size:12px"><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a>No longer want to receive these emails?&nbsp;<a href="" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px">Unsubscribe</a>.<a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a></p> </td></tr></table></td></tr></table>
        </td></tr></table></td></tr></table></td></tr></table></div></body></html>`, // html body
      });

      res.status(200).json({ info });
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      res.status(500).json({
        error: "Hubo un error al enviar el correo electrónico.",
      });
    }
  },

  loginUser: async (req, res, next) => {
    const { email, password } = req.body;

    // chequeando si el email esta registrado
    const [foundUser] = await User.find({ email });
    if (!foundUser) {
      return res.status(301).json({ msg: `Incorrect login.` });
    }

    // comprobando si la contraseña es correcta
    if (await bcrypt.compare(password, foundUser.password)) {
      //genero un token o jwt
      const token = jwt.sign(
        { email: foundUser.email, id: foundUser._id },
        mySecret,

        {
          expiresIn: "30d",
        }
      );
      return res.status(200).json({
        msg: `User logged in.`,
        token,
        success: true,
        userId: foundUser._id,
        userName: foundUser.firstName,
      });
    }

    res.status(403).json({ msg: `Incorrect credentials.`, success: false });
  },

  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(403).json({ msg: `Missing token.`, success: false });
      }
      jwt.verify(token, mySecret, (error, decoded) => {
        if (error) {
          return res
            .status(403)
            .json({ msg: ` Invalid token.`, success: false });
        }

        req.userId = decoded.id;

        return next();
      });
    } catch (error) {
      next(error);
    }
  },

  getMyBicycles: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).populate("bicycles");
      console.log(user);
      res.status(200).json(user.bicycles);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getFavorites: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).populate("favorites");
      res.status(200).json(user.favorites);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  addAndDeleteFavorites: async (req, res, next) => {
    try {
      const bicycleId = req.params.id;
      const user = await User.findById(req.userId);

      const favorites = user.favorites;
      const index = favorites.indexOf(bicycleId);
      if (index !== -1) {
        favorites.splice(index, 1);
        await user.save();
        res.status(200).json({
          message: "Bicycle removed from the favorites list.",
          favorites,
        });
      } else {
        // Agregar la bicicleta a la lista de favoritos del usuario
        user.favorites.push(bicycleId);
        await user.save();

        res.status(200).json({
          message: "Bicycle added to the favorites list.",
          favorites,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteFromFavorites: async (req, res, next) => {
    try {
      const bicycleId = req.params.id;
      const user = await User.findById(req.userId);

      if (user.favorites.includes(bicycleId)) {
        const index = user.favorites.findIndex(
          (item) => item._id === bicycleId
        );
        user.favorites.splice(index, 1);
        await user.save();

        res.status(200).json({
          message: "Bicycle deleted from the favorites list.",
        });
      } else {
        return res.status(400).json({
          message: "Bicycle is not in the favorites list.",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const userToBeDeleted = req.params.id;
      const indexToBeDeleted = await User.findById(userToBeDeleted);

      if (indexToBeDeleted) {
        await User.deleteOne({ _id: indexToBeDeleted });
        res
          .status(200)
          .json({ msg: `User deleted. The id is:  ${userToBeDeleted}` });
      } else {
        res
          .status(404)
          .json({ msg: `User with id ${userToBeDeleted} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },
  changeUser: async (req, res, next) => {
    try {
      const idToBeChanged = req.params.id;

      const newData = req.body;

      let userToBeChanged = await User.findByIdAndUpdate(
        idToBeChanged,
        newData,
        { new: true }
      );

      if (userToBeChanged) {
        res
          .status(200)
          .json({ msg: `User changed. The id is: ${userToBeChanged}` });
      } else {
        res
          .status(404)
          .json({ msg: `User with id ${idToBeChanged} is not found.` });
      }
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req, res, next) => {
    const userEmail = req.body.email;

    try {
      const userToBeConsulted = await User.findOne({ email: userEmail });

      if (!userToBeConsulted) {
        return res.status(404).json({ msg: `User not found.` });
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "sedova4029@gmail.com",
          pass: "ilki pcdv qenn pluw",
        },
      });

      const token = jwt.sign(
        { email: userToBeConsulted.email, id: userToBeConsulted._id },
        mySecret,

        {
          expiresIn: "10m",
        }
      );

      const { info } = await transporter.sendMail({
        from: '"Bikewave" <${bikawaveEmail}>', // sender address
        to: userEmail, // list of receivers
        subject: "Restablecer tu contraseña de bikewave", // Subject line
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: 
            <a href="${myFrontend}/reset-password/${token}">Restablecer Contraseña</a></p>`, // html body
      });

      res
        .status(200)
        .json({ info, msg: "email sent succesfully", success: true });
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    const token = req.params.token;
    console.log("Token decodificado:", token);

    try {
      const decoded = jwt.verify(token, mySecret);
      const userId = decoded.id;

      console.log("ID de usuario decodificado:", userId);
      const userSalt = Math.random().toFixed(7);
      const encryptedPassword = await bcrypt.hash(
        req.body.password,
        Number(userSalt)
      );

      const userToBeChanged = await User.findByIdAndUpdate(
        userId,
        { password: encryptedPassword },
        { new: true }
      );

      if (userToBeChanged) {
        res.status(200).json({
          msg: `La contraseña del usuario se ha cambiado. El ID es: ${userToBeChanged._id}`,
          success: true,
        });
      } else {
        res
          .status(404)
          .json({ msg: `No se encontró un usuario con el ID ${userId}.` });
      }
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      next(error);
    }
  },

  bookBicycle: async (req, res, next) => {
    const userId = req.userId;
    const bicycleId = req.params.bicycleId;
    const ownerId = req.body.ownerId;

    console.log(userId, bicycleId, ownerId);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "sedova4029@gmail.com",
        pass: "ilki pcdv qenn pluw",
      },
    });

    try {
      const user = await User.findById(userId);
      const bicycle = await Bicycle.findById(bicycleId);
      const owner = await User.findById(ownerId);

      if (!user || !bicycle || !owner) {
        return res.status(404).json({ msg: `Not found.` });
      }

      user.rentals.push(bicycle._id);
      await user.save();

      const { info } = await transporter.sendMail({
        from: '"Bikewave" <sedova4029@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: " Detalles de tu nueva reserva!", // Subject line
        html: `<h1>Hola, ${user.firstName}! </h1>
        <p>¡Gracias por tu reserva! Aquí tienes los detalles</p>
        <p> La marca de la bicicleta que has reservado: ${bicycle.brand}</p>
        <p>El modelo : ${bicycle.model}</p>
        <p>El precio : ${bicycle.price} €/dia</p>
        <p>Presiona en el siguiente enlace para abrir el chat con el propietario: </p>
        <a  href="${myFrontend}/chats/">Contactar</a>`, // html body
      });

      res.status(200).json({ info, success: true });
    } catch (error) {
      res.status(500).json({
        error: "Hubo un error al enviar el correo electrónico.",
        success: false,
      });
    }
  },

  changePassword: async (req, res, next) => {
    try {
      //desencriptar la contraseña

      const oldPassword = req.body.oldPassword;
      const userId = req.userId;
      const newPassword = req.body.newPassword;

      const userInfo = await User.findById(userId);

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        userInfo.password
      );

      if (isPasswordValid) {
        const newEncryptedPassword = await bcrypt.hash(
          newPassword,
          Number(userInfo.salt)
        );

        userInfo.password = newEncryptedPassword;
        await userInfo.save();

        res.status(200).json({
          msg: `Password changed .`,
          success: true,
          userInfo,
        });
      } else {
        res.status(400).json({
          msg: `Passwords dont match.`,
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
