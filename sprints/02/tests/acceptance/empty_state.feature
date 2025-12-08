Feature: Üres állapot megjelenítése
  Mint facility manager
  Azt szeretném, hogy amikor még nincs adat a rendszerben,
  egy informatív üres állapot jelenjen meg

  Background:
    Given a felhasználó be van jelentkezve
    And a mock backend elérhető

  Scenario: Üres parkolóhely lista megjelenítése
    Given a backend mock üres parkolóhely listát ad vissza
    When a felhasználó megnyitja a "Parking Spaces" nézetet
    Then egy üres állapot grafika jelenik meg
    And megjelenik a szöveg "Nincs még parkolóhely a rendszerben"
    And megjelenik egy "Parkolóhely hozzáadása" gomb
    And NEM jelenik meg error message

  Scenario: Üres területek lista megjelenítése
    Given a backend mock üres területlistát ad vissza
    When a felhasználó megnyitja az "Areas" nézetet
    Then egy üres állapot üzenet jelenik meg
    And a szöveg tartalmazza "Még nincs parkolási terület definiálva"
    And egy "Terület létrehozása" CTA gomb megjelenik

  Scenario: Üres állapotból való kilépés
    Given a felhasználó az üres "Parking Spaces" nézetben van
    And a mock backend frissül és 5 parkolóhelyet ad vissza
    When a felhasználó frissíti az oldalt
    Then az üres állapot eltűnik
    And a táblázat megjelenik 5 sorral
    And minden sor tartalmaz ID, Státusz, Terület és Frissítve mezőket

  Scenario: Üres állapot reszponzivitás (mobil)
    Given a felhasználó mobil eszközön nyitja meg az appot
    And a backend mock üres listát ad vissza
    When a "Parking Spaces" nézet betöltődik
    Then az üres állapot grafika mobilra optimalizálva jelenik meg
    And a "Parkolóhely hozzáadása" gomb teljes szélességű (full-width)

  Scenario: Accessibility - screen reader támogatás
    Given a felhasználó screen readert használ
    And a backend mock üres listát ad vissza
    When a "Parking Spaces" nézet betöltődik
    Then a screen reader felolvassa "Nincs még parkolóhely a rendszerben"
    And a "Parkolóhely hozzáadása" gomb fókuszálható Tab billentyűvel
