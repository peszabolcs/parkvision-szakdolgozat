Feature: Hiba állapot kezelése
  Mint facility manager
  Azt szeretném, hogy amikor API hiba történik,
  érthető hibaüzenetet lássak és újra tudjam próbálni a lekérést

  Background:
    Given a felhasználó be van jelentkezve
    And a frontend alkalmazás betöltött

  Scenario: API 500 hiba esetén error banner megjelenítése
    Given a mock backend 500 Internal Server Error választ ad vissza
    When a felhasználó megpróbál parkolóhely adatokat lekérni
    Then egy piros error banner jelenik meg az oldal tetején
    And a banner szövege "Hiba történt az adatok lekérésekor. Kérjük, próbálja újra."
    And megjelenik egy "Újrapróbálás" gomb

  Scenario: Újrapróbálás sikeres esetben
    Given a felhasználó látja az error bannert
    And a mock backend most már sikeres választ ad vissza
    When a felhasználó rákattint az "Újrapróbálás" gombra
    Then újra lekérésre kerül az API
    And az error banner eltűnik
    And a parkolóhely adatok megjelennek

  Scenario: Újrapróbálás ismételt hiba esetén
    Given a felhasználó látja az error bannert
    And a mock backend továbbra is 500 hibát ad vissza
    When a felhasználó rákattint az "Újrapróbálás" gombra
    Then újra lekérésre kerül az API
    And az error banner megmarad
    And a hibaüzenet továbbra is látható

  Scenario: Network timeout kezelése
    Given a mock backend 10 másodpercig nem válaszol
    When a timeout lejár
    Then egy error banner jelenik meg
    And a banner szövege "Az adatok lekérése túl sokáig tartott."
    And egy "Újrapróbálás" gomb elérhető

  Scenario: 404 Not Found hiba kezelése
    Given a mock backend 404 Not Found választ ad vissza
    When a felhasználó egy nem létező parkolóhelyet próbál megnyitni
    Then egy error üzenet jelenik meg
    And a szöveg tartalmazza "A keresett parkolóhely nem található"
    And egy "Vissza a listához" link elérhető

  Scenario: Részleges hiba - csak egy endpoint hibázik
    Given a parkolóhelyek API endpoint működik
    And az areas API endpoint 500 hibát ad vissza
    When a Dashboard betöltődik
    Then a parkolóhely statisztikák sikeresen megjelennek
    And az areas widget helyén error üzenet jelenik meg
    And az error üzenet szövege "Nem sikerült betölteni a területeket"
    And a Dashboard többi része továbbra is használható

  Scenario: API hiba után sikeres újratöltés
    Given a felhasználó hibás állapotban van (500 error)
    And a mock backend már helyreállt
    When a felhasználó frissíti az oldalt (F5)
    Then az error banner NEM jelenik meg
    And az adatok sikeresen betöltődnek

  Scenario: Hálózati kapcsolat megszakad
    Given a felhasználó offline módba kerül
    When a parkolóhely adatok lekérése megtörténik
    Then egy error banner jelenik meg
    And a szöveg tartalmazza "Nincs internetkapcsolat"
    And egy "Újrapróbálás" gomb látható

  Scenario: Accessibility - error üzenet képernyőolvasóval
    Given a felhasználó screen readert használ
    And API hiba történik
    When az error banner megjelenik
    Then a screen reader azonnal felolvassa a hibaüzenetet
    And a "role" attribútum értéke "alert"
    And az "aria-live" attribútum értéke "assertive"
