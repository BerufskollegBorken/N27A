# Klausur / Test 2 am 14.1.2020 um 9:30 Uhr

1. Fehler finden und auf Papier dokumentieren
2. alles, was in T1 / K1 relevant war
3. Selbst etwas ausprogrammieren (GUI oder server.js)
4. SQL. Evtl. einen unbekannten SQL-Befehl anhand einer gegebenen Dokumentation selbst erstellen.
5. if und else (auch verschachtelt). Bitte auch die alten if-else-Sachen anschauen im Training-Ordner
6. Symmetrische und asymmetrische Verschlüsselung erklären / gegeneinander abgrenzen. Den Sinn jeweils erklären. Die Implementation am Rechner kurrz beschreiben.




## Beispiel zu If-Else: 

```Javascript
// Wenn ein Schüler / eine Schülerin nicht volljährig ist, wird "Eintritt verweigert".

var darfHinein = "nein"
var alter = 18;

if(alter >= 18){
    darfHinein = "ja"
}

Console.Log("Der Schüler / die Schülerin darf hinein: " + darfHinein )

```

```Javascript
// Wenn ein Schüler / eine Schülerin nicht volljährig ist, wird "Eintritt verweigert".

var darfHinein = ""
var alter = 18;

if(alter >= 18){
    darfHinein = "ja"
}else{
    darfHinein = "nein"
}

Console.Log("Der Schüler / die Schülerin darf hinein: " + darfHinein )

```
```Javascript
// Wenn ein Schüler / eine Schülerin nicht volljährig ist, wird "Eintritt verweigert".

var darfHinein = true
var istVolljaehrig = true;

if(istVolljaehrig){
    darfHinein = true
    Console.Log("Der Schüler / die Schülerin darf hinein.")
}else{
    darfHinein = false
    Console.Log("Der Schüler / die Schülerin darf nicht hinein.")
}



```

```Javascript
// Wenn ein Schüler / eine Schülerin nicht volljährig ist, wird "Eintritt verweigert".
// Schülerinnen zahlen 3 Euro.
// Schüler zahlen 4 Euro.

var darfHinein = true
var istVolljaehrig = true;
var geschlecht = "w"

if(istVolljaehrig){
    
    darfHinein = true
    
    if(geschlecht === "w"){
        Console.Log("Die Schülerin darf hinein. Preis: 3 Euro")
    }else{
        Console.Log("Der Schüler darf hinein. Preis: 4 Euro")
    }
}else{
    darfHinein = false
    Console.Log("Der Schüler / die Schülerin darf nicht hinein.")
}
```





