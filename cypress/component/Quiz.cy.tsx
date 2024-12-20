import React from "react";
import Quiz from "../../client/src/components/Quiz";

const questions = [
  {
    question: "Test question one?",
    answers: [
      { text: "This one is wrong", isCorrect: false },
      { text: "This is correct", isCorrect: true },
      { text: "This is also wrong", isCorrect: false },
      { text: "Also an incorrect answer", isCorrect: false },
    ],
  },
  {
    question: "Test question two?",
    answers: [
      { text: "This one is wrong", isCorrect: false },
      { text: "This is correct", isCorrect: true },
      { text: "This is also wrong", isCorrect: false },
      { text: "Also an incorrect answer", isCorrect: false },
    ],
  },
  {
    question: "Test question three?",
    answers: [
      { text: "This one is wrong", isCorrect: false },
      { text: "This is correct", isCorrect: true },
      { text: "This is also wrong", isCorrect: false },
      { text: "Also an incorrect answer", isCorrect: false },
    ],
  },
  {
    question: "Test question four?",
    answers: [
      { text: "This one is wrong", isCorrect: false },
      { text: "This is correct", isCorrect: true },
      { text: "This is also wrong", isCorrect: false },
      { text: "Also an incorrect answer", isCorrect: false },
    ],
  },
  {
    question: "Test question five?",
    answers: [
      { text: "This one is wrong", isCorrect: false },
      { text: "This is correct", isCorrect: true },
      { text: "This is also wrong", isCorrect: false },
      { text: "Also an incorrect answer", isCorrect: false },
    ],
  },
];

describe("<Quiz />", () => {
  beforeEach(() => {
    // mock the getQuestions API call
    cy.intercept("GET", "api/questions/random", questions).as("getQuestions");
  });

  it("renders the start screen and starts the quiz", () => {
    cy.mount(<Quiz />);

    cy.contains("Start Quiz").should("be.visible").click();

    // wait for the API call to complete
    cy.wait("@getQuestions");

    // verify the first question is displayed
    cy.contains(questions[0].question).should("be.visible");
  });

  it("handles answering questions and completing the quiz", () => {
    cy.mount(<Quiz />);

    // start the quiz
    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");

    // answer the first question correctly (1/10)
    cy.contains(questions[0].answers[1].text).siblings("button").click();

    // verify the second question is displayed
    cy.contains(questions[1].question).should("be.visible");
    // answer the second question incorrectly (1/10)
    cy.contains(questions[1].answers[0].text).siblings("button").click();

    // verify the third question is displayed
    cy.contains(questions[2].question).should("be.visible");
    // answer the third question incorrectly (1/10)
    cy.contains(questions[2].answers[3].text).siblings("button").click();

    // verify the fourth question is displayed
    cy.contains(questions[3].question).should("be.visible");
    // answer the fourth question correctly (2/10)
    cy.contains(questions[3].answers[1].text).siblings("button").click();

    // verify the fifth question is displayed
    cy.contains(questions[4].question).should("be.visible");
    // answer the fifth question correctly (3/10)
    cy.contains(questions[4].answers[1].text).siblings("button").click();

    // verify the quiz completed screen
    cy.contains("Quiz Completed").should("be.visible");
    cy.contains(`Your score: 3/5`).should("be.visible");
  });

  it("restarts the quiz after completion", () => {
    cy.mount(<Quiz />);

    // start the quiz and complete it
    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");
    cy.contains(questions[0].answers[1].text).siblings("button").click();
    cy.contains(questions[1].answers[1].text).siblings("button").click();
    cy.contains(questions[2].answers[1].text).siblings("button").click();
    cy.contains(questions[3].answers[1].text).siblings("button").click();
    cy.contains(questions[4].answers[1].text).siblings("button").click();

    // restart the quiz
    cy.contains("Take New Quiz").click();

    // verify the quiz restarts
    cy.wait("@getQuestions");
    cy.contains(questions[0].question).should("be.visible");
  });
});
