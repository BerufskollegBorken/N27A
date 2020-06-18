const mysql = require('mysql')
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
// Klassendefinition der Klasse Konto. 
// Die Klasse ist der Bauplan, der alle rele- 
// vanten Eigenschaften enthält.

class Konto{
    constructor(){
        this.IdKunde
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

// Deklaration (let kunde) und Instanziierung
// = new Kunde()
// Bei der Instanzziierung werden Speicher-
// zellen reserviert.

let kunde = new Kunde()

// Initialisierung

kunde.IdKunde = 150000
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
const validator = require("email-validator");


const dbVerbindung = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.db
})

dbVerbindung.connect(function(fehler){
    dbVerbindung.query('CREATE TABLE kunde(idKunde INT(11), vorname VARCHAR(45), nachname VARCHAR(45), kennwort VARCHAR(45), mail VARCHAR(45), PRIMARY KEY(idKunde));', function (fehler) {
        if (fehler) {
            if(fehler.code == "ER_TABLE_EXISTS_ERROR"){
                console.log("Tabelle kunde existiert bereits und wird nicht angelegt.")
            }else{
                console.log("Fehler: " + fehler )
            }
        }else{
            console.log("Tabelle Kunde erfolgreich angelegt.")
        }
    })
})

dbVerbindung.connect(function(fehler){
    dbVerbindung.query('CREATE TABLE konto(iban VARCHAR(22), idKunde INT(11), anfangssaldo DECIMAL(15,2), kontoart VARCHAR(20), timestamp TIMESTAMP, PRIMARY KEY(iban));', function (fehler) {
        if (fehler) {
            if(fehler.code == "ER_TABLE_EXISTS_ERROR"){
                console.log("Tabelle konto existiert bereits und wird nicht angelegt.")
            }else{
                console.log("Fehler: " + fehler )
            }
        }else{
            console.log("Tabelle konto erfolgreich angelegt.")
        }
    })
})

// Kunde in die Datenbank schreiben, sofern er noch nicht angelegt ist

dbVerbindung.query('INSERT INTO kunde(idKunde,vorname,nachname,mail,kennwort) VALUES (' + kunde.IdKunde + ',"' + kunde.Vorname + '","' + kunde.Nachname + '","' + kunde.Mail + '","' + kunde.Kennwort + '");', function (fehler) {
    if (fehler) {
        if(fehler.code == "ER_DUP_ENTRY"){
            console.log("Kunde mit ID " + kunde.IdKunde + " existiert bereits und wird nicht erneut in DB angelegt." );
        }else{
            console.log("Fehler: " + fehler.code)
        }
    }else{
        console.log('Kunde mit ID ' + kunde.IdKunde + " erfolgreich in DB angelegt.");
    }
})

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
        konto.IdKunde = idKunde
        konto.Kontonummer = req.body.kontonummer
        konto.Kontoart = req.body.kontoart
        const bankleitzahl = 27000000
        const laenderkennung = "DE"
        konto.Iban = iban.fromBBAN(laenderkennung,bankleitzahl + " " + konto.Kontonummer)
        
        // Füge das Konto in die MySQL-Datenbank ein
    
        dbVerbindung.query('INSERT INTO konto(iban, idKunde, anfangssaldo, kontoart, timestamp) VALUES ("' + konto.Iban + '","' + idKunde + '",100,"' + konto.Kontoart + '",NOW());', function (fehler) {
            if (fehler) {
                if(fehler.code == "ER_DUP_ENTRY"){
                    console.log("Konto mit Iban " + konto.Iban + " existiert bereits und wird nicht erneut in DB angelegt." );
                }else{
                    console.log("Fehler: " + fehler.code)
                }
            }else{
                 console.log('Konto mit Iban ' + konto.Iban + " erfolgreich in DB angelegt.");
            }            
        })

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

        var erfolgsmeldung = "Stammdaten wurden aktualisiert. ";

        if(req.body.nachname){
            kunde.Nachname = req.body.nachname
            erfolgsmeldung += "; Neuer Nachname: " + kunde.Nachname
        }
        
        if(req.body.kennwort){
            kunde.Kennwort = req.body.kennwort
            erfolgsmeldung += "; Neues Kennwort: " + kunde.Kennwort
        }

        if(req.body.mail){
            if(validator.validate(req.body.mail)){
                kunde.Mail = req.body.mail
                erfolgsmeldung += "; Neue E-Mail: " + kunde.Mail
            }else{
                erfolgsmeldung += "; Die E-Mail " + req.body.mail + " ist syntaktisch falsch und wird nicht aktualisiert."    
            }            
        }
        
        res.render('stammdatenPflegen.ejs', {                              
            meldung : erfolgsmeldung
        })
    }else{
        // Die login.ejs wird gerendert 
        // und als Response
        // an den Browser übergeben.
        res.render('login.ejs', {                    
        })    
    }
})

app.get('/ueberweisen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        // ... dann wird kontoAnlegen.ejs gerendert.
        
        res.render('ueberweisen.ejs', {    
            meldung : ""                          
        })
    }else{
        res.render('login.ejs', {                    
        })    
    }
})

app.post('/ueberweisen',(req, res, next) => {   

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
    
        dbVerbindung.query('INSERT INTO konto(iban,anfangssaldo,kontoart,timestamp) VALUES ("' + konto.Iban + '",100,"' + konto.Kontoart + '",NOW());', function (fehler) {
            if (fehler){
                if(fehler.code == "ER_DUP_ENTRY"){
                    console.log("Das Konto mit der IBAN " + konto.Iban + " existiert bereits und wird nicht angelegt.")
                }else{
                    console.log("Fehler: " + fehler)
                }                
            }else{
                console.log('Das Konto wurde erfolgreich angelegt');
            }            
        })

        // ... wird die kontoAnlegen.ejs gerendert.

        res.render('ueberweisen.ejs', {                              
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

app.get('/kontoAnzeigen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        // Hier muss die Datenbank abgefragt werden.

        let kontostand = 10

        dbVerbindung.connect(function(fehler){
            dbVerbindung.query('SELECT anfangssaldo FROM konto WHERE idKunde = "' + idKunde + '";', function (fehler, result) {
                if (fehler) throw fehler
                
                kontostand = result[0].anfangssaldo
                
                console.log('Der Saldo von DE27270000009999990000 ist: ' + kontostand)
                
            })
        })

        res.render('kontoAnzeigen.ejs', {    
            meldung : "Der Saldo von DE27270000009999990000 ist: " + kontostand                          
        })
    }else{
        res.render('login.ejs', {                    
        })    
    }
})
