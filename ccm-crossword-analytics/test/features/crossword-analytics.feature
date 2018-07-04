Feature: Crossword Analytics

  Scenario: View a solved Crossword
    Given I am on the crossword analytics page
    Then I can see crossword results

  Scenario: Filter by user
    Given I am on the crossword analytics page
    When I filter by the user bddtest
    Then I can see 1 solved crosswords