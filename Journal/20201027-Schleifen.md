# Schleifen

Eine Scheife ist ein Anweisungsblock, dessen Anweisungen mehrfach wiederholt werden, bis die Bedingung erfüllt ist.

## Beispiele:

Ein Programm versucht immer wieder eine Verbindung zum Internet herzustellen. Wenn die Verbindung steht, beendet sich die Schleife.

Es sollen eine bestimmte Anzahl von Schritten zuerst in die eine Richtung und dann in eine andere Richtung gegangen werden.

Errechnung von Zins und Zinseszins bei Kreditverträgen.

## Arten von Schleifen:

* for-Schleife
* while-Schleife

## Aufgabe:

Erstelle eine Schleife in der server.js. Es soll von 1 bis 10 hochgezählt werden.


```js
for(var i = 0; i <= 10; i++){
    console.log(i);
}
```

Was passiert im Kopf der for-Schleife:

1. Zunächst wird eine Variable namens i deklariert und mit 0 initialisiert.
2. Der Wert von i wird verglichen mit der zahl 10. Solange i kleiner oder gleich 10 ist, wird der Rumpf der Schleife erneut ausgeführt.
3. Der Wert von i wird mit jedem Schleifendurchlauf um 1 erhöht.

