Feature: Composition of components

  Scenario: View the first web-component
    Given I am on the composition page
    Then I can see the first component

  Scenario: Process crossword shows correct values
    Given I am on the composition page
    When I finish the first component
    Then I can see the second component
