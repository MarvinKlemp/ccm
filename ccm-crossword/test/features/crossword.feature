Feature: Crossword View

  Scenario: View a Crossword
    Given I am on the crossword page
    Then I can see a crossword

  Scenario: Process crossword shows correct values
    Given I am on the crossword page
    When I finish the crossword with the first word Bear and the second word Tiger
    Then I can see the crossword answered correctly

  Scenario: Process crossword shows incorrect values
    Given I am on the crossword page
    When I finish the crossword with the first word Bees and the second word Tiger
    Then I can see the crossword is answered incorrectly