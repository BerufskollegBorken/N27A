
const mysql = require('mysql')
//const env = process.env.NODE_ENV || 'development';
//const config = require('./config')[env];

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

// iban ist ein Modul, das wir uns in das Programm installiert haben:
// npm install iban
// Eine Konstante wird erstellt. Die Konstante heißt iban.
// Die Konstente lebt während der ganzen Laufzeit des Programms.
// Die Konstante iban ist ein Objekt, mit möglicherweise vielen Eigenschaften, Funtkionen usw.
// iban stellt im Programm Funktionalitten zur Verfügung: 
// * Umwandlung der Kontonummer nach IBAN.
// * Validierung einer IBAN.

const iban = require('iban')

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const validator = require("email-validator");

const dbVerbindung = mysql.createConnection({
    host: '10.40.38.110', //130.255.124.99
    user: 'placematman',
    password: "BKB123456!",
    database: "dbn27"
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
    dbVerbindung.query('CREATE TABLE konto(iban VARCHAR(22), idKunde INT(11), kontoart VARCHAR(20), timestamp TIMESTAMP, PRIMARY KEY(iban));', function (fehler) {
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

// Eigenschaften einer Kontobewegung: iban  VARCHAR(22), betrag DECIMAL(15,2), verwendungszweck VARCHAR(378), timestamp TIMESTAMP 
// Ein neue Tabelle ist zu erstellen namens kontobewegung.
// Primary Key: iban, timestamp
// Foreign Key: iban     // Der FK verhindert, dass eine Kontobewegung zu einer fiktiven iban angelegt wird.   
                        // Durch die Foreign Key-Angabe wird verhindert, dass ein Konto gelöscht wird, zu dem es noch Kontobewegungen gibt.


dbVerbindung.connect(function(fehler){
    dbVerbindung.query('CREATE TABLE kontobewegung(quellIban VARCHAR(22), zielIban VARCHAR(22), betrag DECIMAL(15,2), verwendungszweck VARCHAR(378), timestamp TIMESTAMP, PRIMARY KEY(quellIban, timestamp), FOREIGN KEY (quellIban) REFERENCES konto(iban));', function (fehler) {
        if (fehler) {
            if(fehler.code == "ER_TABLE_EXISTS_ERROR"){
                console.log("Tabelle kontobewegung existiert bereits und wird nicht angelegt.")
            }else{
                console.log("Fehler: " + fehler )
            }
        }else{
            console.log("Tabelle kontobewegung erfolgreich angelegt.")
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

// Die Funktionalitäten des weather-Moduls werden der Konstanten weather zugewiesen.
const weather = require('weather-js');

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
 
        // Die Funktion find() gibt das Wetter zu den Angaben in den runden Klammern zurück.
        weather.find({search: 'Berlin', degreeType: 'C'}, function(err, result) {
            if(err) console.log(err);
    
            // stringify ist eine Funktion, die auf das JSON-Objekt aufgerufen den result in einem
            // langen String zurückgibt. 
            console.log(JSON.stringify(result, null, 2));

            console.log("Der ganze Result: " + result)
            // Der Result ist eine Liste von Objekten. Wenn der angegebene Ortsname mehrfach existiert, hat die Liste mehr als einen Eintrag.
            console.log("Vom ersten Element der Name des Orts " + result[0].location.name);
            console.log("Vom ersten Element die aktuelle Temperatur :" + result[0].current.temperature);
 
            res.render('index.ejs', {    
                ort : "Borken",
                meldungWetter : result[0].location.name + " " + result[0].current.temperature + " °" + result[0].location.degreetype,  
                meldung : process.env.PORT || 3000       
            }) 
        });        
    }else{
        res.render('login.ejs', {                    
        })    
    }
})

app.post('/',(req, res, next) => {   
    
    console.log("app.post(/...")
    
    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Der Cookie wird gesetzt: " + idKunde)
        res.cookie('istAngemeldetAls', idKunde)

        let ort = req.body.ort

        if(!ort){
            ort = "Borken"
        }

        weather.find({search: ort, degreeType: 'C'}, function(err, result) {
            if(err) console.log(err);
    
            res.render('index.ejs', {    
                ort : result[0].location.name,
                meldungWetter :  result[0].current.temperature + " °" + result[0].location.degreetype,  
                meldung : process.env.PORT || 3000       
            }) 
        });        
    }else{            
        console.log("Der Cookie wird gelöscht")
        res.cookie('istAngemeldetAls','')
        res.render('login.ejs', {                    
        })
    }
})

app.post('/login',(req, res, next) => {   
    
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
        console.log("Der Cookie wird gesetzt: " + idKunde)
        res.cookie('istAngemeldetAls', idKunde)

        let ort = req.body.ort

        if(!ort){
            ort = "Borken"
        }

        weather.find({search: ort, degreeType: 'C'}, function(err, result) {
            if(err) console.log(err);
    
            res.render('index.ejs', {    
                ort : result[0].location.name,
                meldungWetter :  result[0].current.temperature + " °" + result[0].location.degreetype,  
                meldung : process.env.PORT || 3000       
            }) 
        });        
    }else{            
        console.log("Der Cookie wird gelöscht")
        res.cookie('istAngemeldetAls','')
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
        
        if(konto.Kontonummer == ""){
            res.render('kontoAnlegen.ejs', {                              
                meldung : "Zum Kontoanlegen bitte Kontonummer angeben!"
            })                             
        }else{
            konto.Kontoart = req.body.kontoart
            const bankleitzahl = 27000000
            const laenderkennung = "DE"
            konto.Iban = iban.fromBBAN(laenderkennung,bankleitzahl + " " + konto.Kontonummer)
            
            // Füge das Konto in die MySQL-Datenbank ein
        
            dbVerbindung.query('INSERT INTO konto(iban, idKunde, kontoart, timestamp) VALUES ("' + konto.Iban + '","' + idKunde + '","' + konto.Kontoart + '",NOW());', function (fehler) {
                if (fehler) {
                    if(fehler.code == "ER_DUP_ENTRY"){
                        console.log("Konto mit Iban " + konto.Iban + " existiert bereits und wird nicht erneut in DB angelegt." );
                        // ... wird die kontoAnlegen.ejs gerendert.

                        res.render('kontoAnlegen.ejs', {                              
                            meldung : "Konto mit Iban " + konto.Iban + " existiert bereits und wird nicht erneut in DB angelegt." 
                        })
                    }else{
                        console.log("Fehler: " + fehler.code)
                        res.render('kontoAnlegen.ejs', {                              
                            meldung : "Sonstiger Fehler: " + fehler.code
                        })
                    }
                }else{
                    console.log("Konto mit Iban " + konto.Iban + " erfolgreich in DB angelegt.");    
                    res.render('kontoAnlegen.ejs', {                              
                        meldung : "Konto mit Iban " + konto.Iban + " erfolgreich in DB angelegt."
                    })                             
                }            
            })
        }
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

// Die Funktion wird aufgerufen, wenn die Seite ueberweisen im Browser aufgerufen wird.

app.get('/ueberweisen',(req, res, next) => {   

    // Der Cookie mit dem Namen 'istAngemeldetAls' wird abgefragt und der Variablen idKunde zugewiesen.

    let idKunde = req.cookies['istAngemeldetAls']
    
    // Wenn idKunde ungleich leer oder null, dann ist der Wert von idKunde == true

    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        // Es wird eine neue Variable deklariert namens quellkonten. Die Variable lebt innerhalb der if(idKunde)-Kontrollstruktur.

        let quellkonten

        dbVerbindung.connect(function(fehler){
            dbVerbindung.query('SELECT iban FROM konto WHERE idKunde = "' + idKunde + '";', function (fehler, quellkontenResult) {
                if (fehler) throw fehler
                
                console.log(quellkontenResult)
        
                // Der neuen Varablen quellkonten wird der Result aus der Datenbankabfrage zugewiesen

                quellkonten = quellkontenResult
            })
        })

        dbVerbindung.connect(function(fehler){
            dbVerbindung.query('SELECT iban FROM konto;', function (fehler, zielkontenResult) {
                if (fehler) throw fehler
                
                console.log(zielkontenResult)
        
                // Die ueberweisen-Seite wid mit den übergebeben quellkonten und zielkonten an den Browser übergeben.

                res.render('ueberweisen.ejs', {    
                    meldung : "",
                         quellkonten : quellkonten,
                         zielkonten : zielkontenResult                     
                })
            })
        })
    }else{
        res.render('login.ejs', {                    
        })    
    }
})

// Die app.post wird abgearbeitet, wenn der Button auf dem Formular gedrückt wird.

app.post('/ueberweisen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){

        console.log("Kunde ist angemeldet als " + idKunde)
        
        // Die quelliban und zieliban wird "requestet", d. h. beim Browser angefragt und den Variablen zugewiesen

        var quellIban = req.body.quellIban
        var zielIban = req.body.zielIban

        // Wenn Quell- und Zieliban gleich sind, wird eine Meldung gerendert.

        if(quellIban === zielIban){
            res.render('index.ejs', {                              
                meldung : "Die Quelliban und die Zieliban dürfen nicht übereinstimmen."
            })    
        }else{
            var betrag = req.body.betrag

            if(betrag < 0){
                res.render('index.ejs', {                              
                    meldung : "Bitte nur positive Eurobeträge eingeben."
                })    
            }else{
                var verwendungszweck = req.body.verwendungszweck
            
                if(verwendungszweck == ""){
                    res.render('index.ejs', {                              
                        meldung : "Bitte einen Verwendungszweck eingeben."
                    })  
                }else{

                    console.log("Überweisung wird ausgeführt: " + quellIban + " -> " + zielIban + "| Betrag: " + Math.abs(betrag) + " | Vz:" + verwendungszweck)

                    // Kontobewegungen einfügen 
    
                    dbVerbindung.query('INSERT INTO kontobewegung(quellIban, zielIban, timestamp, betrag, verwendungszweck) VALUES ("' + quellIban + '","' + zielIban + '",NOW(),' + betrag + ',"' + verwendungszweck + '");', function (fehler) {
                        if (fehler){
                            if(fehler){
                                console.log("Überweisung auf Konto " + zielIban + " konnte nicht ausgeführt werden." + fehler)
                            }               
                        }else{
                            console.log("Überweisung auf Konto " + zielIban + " erfolgreich durchgeführt.");
                        }            
                    })
    
                    // ... wird die kontoAnlegen.ejs gerendert.
    
                    res.render('index.ejs', {                              
                        meldung : "Die Überweisung an " + zielIban + " wurde erfolgreich durchgeführt."
                    })
                }                
            }
        }
    }else{
        // Die login.ejs wird gerendert 
        // und als Response
        // an den Browser übergeben.
        res.render('login.ejs', {                    
        })    
    }
})


app.get('/zinsen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        // ... dann wird kontoAnlegen.ejs gerendert.
        
        res.render('zinsen.ejs', {    
            meldung : ""                          
        })
    }else{
        res.render('login.ejs', {                    
        })    
    }
})

app.post('/zinsen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){
        console.log("Kunde ist angemeldet als " + idKunde)
        
        var zinssatz = parseFloat(req.body.zinssatz + 1)
        var anfangskapital = req.body.anfangskapital
        var laufzeit = req.body.laufzeit
        var endkapital = anfangskapital

        console.log("zinssatz: " + zinssatz)
        console.log("Anfangskapital: " + anfangskapital)
        console.log("Laufzeit: " + laufzeit)
        console.log("Endkapital: " + endkapital)

        // Wenn rechts oder links vom Plus-Operator ein String steht, wird der Plus-Operator eine Verkettung durchführen.
        // Wenn links und rechts eine Zahl steht, wird eine Addition vorgenommen.
        // Die Zahlen aus dem Request sind Strings. Also müssen sie erst konvertiert werden.

        for(laufzeit; laufzeit > 0; laufzeit--){
            endkapital = zinssatz + (endkapital * zinssatz / 100)            
            console.log("Endkapital: " + endkapital)
        }
        

        res.render('zinsen.ejs', {                              
            meldung : "Der Endbetrag nach " + req.body.laufzeit + " Jahren ist " + endkapital + "€."
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

        dbVerbindung.connect(function(fehler){
            dbVerbindung.query('SELECT iban FROM konto WHERE idKunde = "' + idKunde + '";', function (fehler, result) {
                if (fehler) throw fehler
                
                res.render('kontoAnzeigen.ejs', {    
                    konten : result
                })
            })
        })
    }else{
        res.render('login.ejs', {                    
        })    
    }
})

app.post('/kontoAnzeigen',(req, res, next) => {   

    let idKunde = req.cookies['istAngemeldetAls']
    
    if(idKunde){

        console.log("Kunde ist angemeldet als " + idKunde)
        
        // Die Iban wird requestet       

        var iban = req.body.iban
        var kontostand = 0     
        console.log("Konto " + iban + " wird abgefragt.")

        // Kontobewegungen einfügen

        dbVerbindung.query('SELECT betrag FROM kontobewegung WHERE quelliban = "' + iban + '";', function (fehler, result) {
            if (fehler) throw fehler
            
            for(var i = 0;i < result.length;i++){                
                kontostand = kontostand - result[i].betrag                
            }

            dbVerbindung.query('SELECT betrag FROM kontobewegung WHERE zieliban = "' + iban + '";', function (fehler, result) {
                if (fehler) throw fehler
                
                for(var i = 0;i < result.length;i++){                
                    kontostand = kontostand + result[i].betrag                
                }
                console.log("Kontostand der Iban " + iban + " ist: " + kontostand + ".")

                // ... wird die kontoAnlegen.ejs gerendert.
        
                res.render('index.ejs', {                              
                    meldung : "Kontostand des Kontos mit der Iban " + iban + " ist: " + kontostand + " €."
                })
            })
        })
    }else{
        // Die login.ejs wird gerendert 
        // und als Response
        // an den Browser übergeben.
        res.render('login.ejs', {                    
        })    
    }
})

