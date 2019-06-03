class Konto{
    constructor(){
        this.Kontonummer
        this.Kontoart
        this.Iban
    }
}

<<<<<<< HEAD
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
    }
}

// Deklaration und Instanziierung

let kunde = new Kunde()

// Initialisierung

kunde.IdKunde = 4711
kunde.Kennwort = "123"
kunde.Geschlecht = "w"
kunde.Nachname = "Schmidt"
kunde.Vorname = "Hildegard"
kunde.Geburtsdatum = "1999-12-31"
kunde.Adresse = "Berlin"

=======
class Kunde{
    constructor(){
        this.Vorname
        this.Nachname
        this.Geschlecht
        this.IdKunde
        this.Geburtsdatum
        this.Adresse
        this.Kennwort
    }
}

let kunde = new Kunde()
kunde.IdKunde = 4711
kunde.Kennwort = "123"
kunde.Geburtsdatum = "1999-12-31"
kunde.Nachname = "Franz"
kunde.Vorname = "Valerie"
kunde.Geschlecht = "w"

const iban = require('iban')
>>>>>>> 0e09dc9cbe36c34a95f91e051b4f49642f26d3b4
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

const server = app.listen(process.env.PORT || 3000, () => {

    // Ausgabe von 'Server lauscht ...' im Terminal
    console.log('Server lauscht auf Port %s', server.address().port)    
})

// Die app.get('/'...) wird abgearbeitet, wenn die Startseite
// im Browser aufgerufen wird.
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