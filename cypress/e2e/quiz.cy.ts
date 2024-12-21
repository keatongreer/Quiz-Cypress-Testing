describe("Quiz App", () => {
  let questions: any[] = [];

  beforeEach(() => {
    cy.visit("/");
    cy.fixture("questions.json").then((mockQuestions) => {
      // mock the getQuestions API call
      cy.intercept("GET", "api/questions/random", mockQuestions).as(
        "getQuestions"
      );

      // set the questions for the test
      questions = mockQuestions;
    });
  });

  it("starts the quiz and completes it", () => {
    // start the quiz
    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");

    // answer all questions
    questions.forEach((question) => {
      cy.contains(question.question).should("be.visible");
      cy.get("button").eq(1).click();
    });

    // verify completion screen
    cy.contains("Quiz Completed").should("be.visible");
    cy.contains("Your score: 5/5").should("be.visible");
  });

  it("handles restarting the quiz", () => {
    // complete the quiz
    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");
    questions.forEach(() => {
      cy.get("button").eq(1).click();
    });

    // restart the quiz
    cy.contains("Take New Quiz").click();
    cy.wait("@getQuestions");

    // verify quiz restarts
    cy.contains(questions[0].question).should("be.visible");
  });

  it("handles incorrect answers and displays the correct score", () => {
    // start the quiz
    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");

    // answer all questions
    cy.get("button").eq(0).click(); // incorrect for question 1
    cy.get("button").eq(1).click(); // correct for question 2
    cy.get("button").eq(2).click(); // incorrect for question 3
    cy.get("button").eq(3).click(); // incorrect for question 4
    cy.get("button").eq(1).click(); // correct for question 5

    // verify completion screen with the correct score
    cy.contains("Quiz Completed").should("be.visible");
    cy.contains("Your score: 2/5").should("be.visible");
  });
});
