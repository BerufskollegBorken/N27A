/**
 * Hier können Sie IF und ELSE trainieren.
 * Am besten dazu den nodemon starten:
 * 
 *      .\node_modules\.bin\nodemon Training\if-else-training.js
 * 
 * Dann die Ausgabe im Terminal beobachten.
 */

// Deklaration und Initialisierung 
// Lies: "Der Wert 0 wird zugewiesen an
//        eine Variable namens x"
 
let x = 0
let y = 1

if("GW11A".endsWith("A")||"GW11A".endsWith("B")||"GW11A".startsWith("GT")){
    console.log("Die Prüfung ist WAHR. Es werden die Anweisungen im Rumpf von IF ausgeführt.")
}else{
    console.log("Die Prüfung ist FALSCH. Es werden die Anweisungen im Rumpf von ELSE ausgeführt.")
}


// FÄLLE:

// 22. if()

// 21 if ("Gw11a".endsWith("a")) Der Ausdruck ist Wahr. Die Funktion prüft, ob eine Zeichenkette mit einer anderen endet.

// 20. if("GW11A".includes("11")) Der Ausdruck ist Wahr. Die Funktion prüft, ob eine Zeichenkette eine andere Zeichenkette enthält.

// 19. if("GW11A".startsWith("G")) Der Ausdruck ist Wahr. Die Funktion prüft, ob eine Zeichenkette mit einer anderen Zeichenkette beginnt.

// 18. if("GW11A".length === 5) Der Ausdruck ist wahr. Die Eigenschaft length gibt die Anzahl der Zeichen einer Zeichenkette zurück.

// 17. if(undefined)    Der Ausdruck ist falsch. Ein Objekt ist undefined, wenn sie nicht existiert.

// 16. if(1 > 2 || 1 == 1) Der Ausdruck ist wahr, weil eine der beiden Prüfungen wahr ist.
// 15. if(1 > 2 && 1 == 1) Der Ausdruck ist Falsch, weil die erste Prüfung Falsch ist.Alle mit && verketteten Prüfungen müssen Wahr sein, damit die Prüfung insgesamt Wahr wird.
// 14. if(false)      Der Ausdruck ist falsch. 

// 13. if (true)    Der Ausdruck ist wahr.

// 12. if (0)      Die Zahl 0 ist falsch.

// 11. if (-123)   Zahlen sind wahr bis auf 0.

// 10. if("")      leere Zeichenketten in javascript sind falsch.

// 9. if("ah")     nicht leere Zeichenketten in javascript sind wahr.

//8. if(1 != 0)     Vergleichsoperator: "ungleich"       Der Ausdruck ist wahr.

// 7. if(1 <= 1)    Vergleichsoperator: "kleiner gleich"    Der Ausdruck ist wahr.

// 6. if(1 >= 1)    Vergleichsoperator: "größer gleich"   Der Ausdruck ist wahr.

// 5. if(1 === "1") Vergleichsoperator: "gleich"          Der Ausdruck ist falsch.
//                  Das 3fache "===" prüft auf Gleichheit des Wertes und des Typs.
//                  "1" : String / Zeichenkette
//                   1  : Zahl 

// 4. if(1 == "1")  Vergleichsoperator: "gleich"          Der Ausdruck ist wahr.
//                  Das doppelte "==" prüft auf Gleichheit des Wertes,
//                  aber nicht auf Gleichheit des Typs.

// 3. if(0 == 1)    Vergleichsoperator: "gleich"          Der Ausdruck ist falsch.

// 2. if(0 > 1)      Vergleichsoperator: "größer als"     Der Ausdruck ist falsch.

// 1. if(0 < 1)      Vergleichsoperator: "kleiner als"    Der Ausdruck ist wahr.