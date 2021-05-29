const Config = require("../config/company.config")
const db = require("../models")
const roles = require('./roles.js');
const Facilities = db.facilities
const Users = db.users
const pdfMakePrinter = require("pdfmake/src/printer")
var path = require("path")

let repNum = 0

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "..", "bin", "/fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "..", "bin", "/fonts/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "..", "bin", "/fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(
      __dirname,
      "..",
      "bin",
      "/fonts/Roboto-MediumItalic.ttf"
    ),
  },
}

const styles = {
  tableComponents: {
    margin: [0, 5, 0, 15],
  },
  headerComponents: {
    fontSize: 16,
    bold: true,
    margin: [0, 10, 0, 5],
  },
  footerComponents: {
    margin: [0, 10, 0, 5],
  },
  header: {
    fontSize: 18,
    bold: true,
  },
  subheader: {
    fontSize: 15,
    bold: true,
  },
  quote: {
    italics: true,
  },
  small: {
    fontSize: 8,
  },
  tableExample: {
    margin: [0, 5, 0, 15],
    fontSize: 8,
  },
}

exports.generate = async (req, res) => {
  const permissionCreate = roles.can(req.session.role).createAny('reports');
  if (permissionCreate.granted) {
    let data = await Facilities.findAll()

    const docDefinition = {
      content: [await generateHeader(data, req), generateTable(data)],
      footer: generateFooter(),
      styles: styles,
    }

    generatePdf(docDefinition, (response) => {
      res.setHeader("Content-Type", "application/pdf")
      res.send(response) // Buffer data
    })
  }
  else{
      // resource is forbidden for this user/role
      res.status(403).end();
  }
}

const generateHeader = async (data, req) => {
  let users = Users.findAll()

  let admins = await Users.findAll({
    where: {
      role: "admin",
    },
  })

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  repNum++

  await Promise.all([users, admins]).then((res) => {
    users = res[0]
    admins = res[1]
  })

  return [
    {
      text: `${Config.FACTORYNAME} / ${Config.BRANCHNAME}`,
      style: "header",
    },
    {
      text:
        "______________________________________________________________\n\n",
      style: "header",
    },
    `   Report Nr. ${repNum}  Report erstellt am: ${new Date().toLocaleDateString(
      "de-DE",
      options
    )}  Aministrator: ${req.session.email}\n\n`,
    {
      style: "tableExample",
      table: {
        widths: ["100%"],
        body: [
          [
            `Anzahl Komponenten: ${
              data.length
            }                                                                                                    Risikobewertung: niedrig (Komponenten kürzlich gewartet) 
            Anzahl Mitarbeiter: ${users.length}
            Administratoren: ${admins.length} 
            Sonstige Mitarbeiter: ${users.length - admins.length}`,
          ],
        ],
      },
    },
    {
      text: "\n",
      style: "header",
    },
  ]
}

const generateTable = (data) => {
  return [
    { text: "Komponenten", style: "headerComponents" },
    {
      style: "tableComponents",
      table: {
        body: [
          [
            "ID",
            "Typ",
            "Erstellt",
            "Aktualisiert",
            "Eigenschaften",
            "Kommentar",
          ],
          ...data.map((fac) => [
            fac.id,
            fac.name,
            String(fac.createdAt),
            String(fac.updatedAt),
            fac.customFields,
            fac.description,
          ]),
        ],
      },
    },
  ]
}

const generateFooter = () => {
  return function (currentPage, pageCount) {
    return {
      columns: [
        { text: "Firma:" + Config.COMPANYNAME, alignment: "left" },
        { text: "Niederlassung: " + Config.BRANCHNAME, alignment: "center" },
        {
          text: "Seite " + currentPage.toString() + " von " + pageCount,
          alignment: "right",
        },
      ],
      margin: [10, 5, 10, 2],
    }
  }
}

function generatePdf(docDefinition, callback) {
  try {
    const printer = new pdfMakePrinter(fonts)
    const doc = printer.createPdfKitDocument(docDefinition)

    let chunks = []

    doc.on("data", (chunk) => {
      chunks.push(chunk)
    })

    doc.on("end", () => {
      callback(Buffer.concat(chunks))
    })

    doc.end()
  } catch (err) {
    throw err
  }
}
