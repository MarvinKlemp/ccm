Feature: Crossword Builder

  Scenario: View the Crossword Builder
    Given I am on the crossword builder page
    Then I can see a crossword-builder

  Scenario: Input without words warns user
    Given I am on the crossword builder page
    When I generate the crossword
    Then I can see the warning: Bitte füllen Sie alle Felder aus.

  Scenario: Input without words warns user
    Given I am on the crossword builder page
    When I remove all words
    When I generate the crossword
    Then I can see the warning: Bitte fügen Sie Wörter hinzu.

  Scenario: Input without words warns user
    Given I am on the crossword builder page
    When I input the words Java with question java and Scala with question scala
    When I generate the crossword
    Then I can see a generated crossword