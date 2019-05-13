class Konto{
    constructor(){
        this.Kontonummer
        this.Kontoart
        this.Iban
    }
}

const iban = require('iban')
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
    
    const idKunde = req.body.idKunde
    const kennwort = req.body.kennwort
        
    if(idKunde === "4711" && kennwort === "123"){            
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