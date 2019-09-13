class Konto{
    constructor(){
        this.Kontonummer
        this.Kontoart
        this.Iban
    }
}

// Klassendefinition

class Kunde {
    constructor(){
        this.IdKunde
        this.Kennwort
        this.Vorname
        this.Geburtsdatum
        this.Nachname
        this.Adresse
        this.Geschlecht        
        this.Mail
    }
}

// Deklaration und Instanziierung

let kunde = new Kunde()

// Initialisierung

kunde.IdKunde = 4711
kunde.Kennwort = "123"
kunde.Geburtsdatum = "1999-12-31"
kunde.Nachname = "Müller"
kunde.Vorname = "Hildegard"
kunde.Geschlecht = "w"
kunde.Mail = "h.mueller@web.de"

const iban = require('iban')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mysql = require('mysql')

const dbVerbindung = mysql.createConnection({
    host: '10.40.38.110',
    user: 'placematman',
    password: 'BKB123456!',
    db: 'dbn27',
    port: '3306'
})

dbVerbindung.connect()


const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

const server = app.listen(process.env.PORT || 3000, () => {

    // Ausgabe von 'Server lauscht ...' im Terminal
    console.log('Server lauscht auf Port %s', server.address().port)    
})

// Wenn die Startseite im Browser aufgerufen wird, ...

app.get('/',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        res.render('index.ejs', {                              
        })
    }else{
        res.render('login.ejs', {                    
        })    
    }
})

// Wenn die Seite localhost:3000/impressum aufgerufen wird, ...

app.get('/impressum',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        // ... dann wird impressum.ejs gerendert.
        
        res.render('impressum.ejs', {                              
        })
    }else{
        res.render('login.ejs', {                    
        })    
    }
})

app.get('/login',(req, res, next) => {         
    res.cookie('istAngemeldetAls', '')       
    res.render('login.ejs', {                    
    })
})

app.post('/',(req, res, next) => {   
    
    // Der Wert des Inputs mit dem name = "idkunde" wird über
    // den Request zugewiesen an die Konstante idKunde
    const idKunde = req.body.idKunde
    const kennwort = req.body.kennwort
    
    console.log(idKunde + " == " + kunde.IdKunde + "&&" + kennwort + " == " + kunde.Kennwort)

    // Wenn der Wert von idKunde dem Wert der Eigenschaft kunde.IdKunde
    // entspricht UND der Wert von kennwort der Eigenschaft kunde.Kennwort
    // entspricht, dann werden die Anweisungen im Rumpf der if-Kontrollstruktur
    // abgearbeitet.
    if(idKunde == kunde.IdKunde && kennwort == kunde.Kennwort){            
        console.log("Der Cookie wird gesetzt:")
        res.cookie('istAngemeldetAls', idKunde)
        res.render('index.ejs', {  
            kunde : idKunde          
        })
    }else{            
        console.log("Der Cookie wird gelöscht")
        res.cookie('istAngemeldetAls','')
        res.render('login.ejs', {                    
        })
    }
})

// Wenn die Seite localhost:3000/kontoAnlegen angesurft wird, ...

app.get('/kontoAnlegen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        // ... dann wird kontoAnlegen.ejs gerendert.
        
        res.render('kontoAnlegen.ejs', {    
            meldung : ""                          
        })
    }else{
        res.render('login.ejs', {                    
        })    
    }
})

// Wenn der Button auf der kontoAnlegen-Seite gedrückt wird, ...

app.post('/kontoAnlegen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        let konto = new Konto()

        // Der Wert aus dem Input mit dem Namen 'kontonummer'
        // wird zugewiesen (=) an die Eigenschaft Kontonummer
        // des Objekts namens konto.
        konto.Kontonummer = req.body.kontonummer
        konto.Kontoart = req.body.kontoart
        const bankleitzahl = 27000000
        const laenderkennung = "DE"
        konto.Iban = iban.fromBBAN(laenderkennung,bankleitzahl + " " + konto.Kontonummer)
        
        // Füge das Konto in die MySQL-Datenbank ein
    
        dbVerbindung.query('INSERT INTO konto(iban,timestamp,anfangssaldo,kontoart) VALUES ("' + konto.Iban + '",now(),100,"' + konto.Kontoart + '");', function (error, results, fields) {
            if (error) throw error;
            console.log('Das Konto wurde erfolgreich angelegt');
        });

        // ... wird die kontoAnlegen.ejs gerendert.

        res.render('kontoAnlegen.ejs', {                              
            meldung : "Das " + konto.Kontoart + " mit der IBAN " + konto.Iban + " wurde erfolgreich angelegt."
        })
    }else{
        // Die login.ejs wird gerendert 
        // und als Response
        // an den Browser übergeben.
        res.render('login.ejs', {                    
        })    
    }
})

app.get('/stammdatenPflegen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        // ... dann wird kontoAnlegen.ejs gerendert.
        
        res.render('stammdatenPflegen.ejs', {    
            meldung : ""                          
        })
    }else{
        res.render('login.ejs', {                    
        })    
    }
})

app.post('/stammdatenPflegen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        // Nur, wenn das Input namens nachname nicht leer ist, wird der
        // Nachname neu gesetzt.

        if(req.body.nachname){
            kunde.Nachname = req.body.nachname
        }
        
        if(req.body.kennwort){
            kunde.Kennwort = req.body.kennwort
        }

        if(req.body.email){
            kunde.Mail = req.body.email
        }
        
        res.render('stammdatenPflegen.ejs', {                              
            meldung : "Die Stammdaten wurden geändert. Neuer Nachname: " + kunde.Nachname + " Neue Mail: " + kunde.Mail
            
        })
    }else{
        // Die login.ejs wird gerendert 
        // und als Response
        // an den Browser übergeben.
        res.render('login.ejs', {                    
        })    
    }
})

