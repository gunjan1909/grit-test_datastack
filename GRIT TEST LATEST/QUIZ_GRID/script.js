var quiz = $("#quiz"); //Quiz div object
var questionCounter = 0; //Tracks question number
var selections = []; //Array containing user choices
var final_score = 1; //final score
var points;
var test_history = [];
var snake_encountered = 0;
//RETURNS DOM ELEMENT FOR QUESTION
function createQuestionElement(questions, index, type) {
  // creating div
  var qElement = $("<div>", {
    id: "question",
  });
  var paraElement = $("<div>", {
    id: "questionP",
  });
  var textELement = $("<p>", {
    id: "questionText",
  });
  // question heading
  var header = $("<h2>Question " + (index + 1) + ":</h2>");
  // radio buttons and input type text
  var radioButtons;
  //mcq type
  if (questions[index].type === "mcq") {
    qElement.append(header);
    var question = $("<p>").append(
      questions[index].qid + ". " + questions[index].question
    );
    qElement.append(question);
    radioButtons = $("<ul>", {
      class: "radioList",
    });
    var item;
    var input = "";
    // mcq type radio options
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $("<li>");
      input = `<input type="radio" name=${index} value = ${i} ></input>`;
      input += questions[index].choices[i];
      item.append(input);
      radioButtons.append(item);
    }
    qElement.append(radioButtons);
    return qElement;
  }
  // text type
  else if (questions[index].type === "text") {
    textELement.append(header);
    var question3 = $("<p>").append(
      questions[index].qid + ". " + questions[index].question
    );
    // text input
    textELement.append(question3);
    var textInput = $("<input>", {
      type: "text",
      id: "textInput",
    });
    textELement.append(textInput);
    return textELement;
  }
  // paragraph type
  else if (questions[index].type === "para") {
    paraElement.append(header);
    // adding paragraph
    var question2 = $("<p>").append(
      questions[index].qid + ". " + questions[index].question
    );
    paraElement.append(question2);
    // paragraph sub questions
    questions[index].paraQuesOption.map((ques, j) => {
      var paraQuesOption = $("<p>").append(ques.qid + ". " + ques.question);
      paraElement.append(paraQuesOption);
      radioButtons = $("<ul>", {
        class: "radioList",
      });
      var item;
      var input = "";
      const count = ques.choices.length;
      // options for each sub question
      for (var i = 0; i < Number(count); i++) {
        item = $("<li>");
        input = `<input type="radio" name=${j} value = ${i} ></input>`;
        input += ques.choices[i];
        item.append(input);
        radioButtons.append(item);
      }
      paraElement.append(radioButtons);
    });
    return paraElement;
  }
}

//RETURNS USER SELECTED ANSWER
function choose(questions, questionCounter, selections) {
  if (questions[questionCounter].type === "mcq") {
    selections[questionCounter] = +$("input:checked").val();
    return selections[questionCounter];
  } else if (questions[questionCounter].type === "text") {
    selections[questionCounter] = $("#textInput").val();
    return selections[questionCounter];
  } else if (questions[questionCounter].type === "para") {
    const count = questions[questionCounter].paraQuesOption.length;
    var paraSelections = [];
    for (var i = 0; i < Number(count); i++) {
      var paraAnswer = new Object();
      paraAnswer.answer = $(`input[name=${i}]:checked`).val();
      paraAnswer.qid = questions[questionCounter].paraQuesOption[i].qid;
      paraSelections.push(paraAnswer);
    }
    selections[questionCounter] = paraSelections;
    return selections[questionCounter];
  }
}

// get and store questions
var questions = getQuestions();

// fetch question from json/backend
function getQuestions() {
  fetch(`./questions.json`)
    .then((response) => {
      return response.json();
    })
    .then((rsp) => {
      questions = rsp;
      displayNext(); // to display the first question
    });
}

// MAIN LISTNERS FOR "NEXT" BUTTONS

$("#next").on("click", function (e) {
  e.preventDefault();
  // Suspend click listener during fade animation
  if (quiz.is(":animated")) {
    return false;
  }
  //store user's response in answer, pass it to check points/ checkAnswer
  var answer = choose(questions, questionCounter, selections);
  //checks the answer and store the points
  points = checkAnswer(answer, questions[questionCounter].qid);

  // (i) FINAL SCORE
  final_score += points;
  console.log(final_score);

  /* CALL JYTOI'S FUNCTION FOR GRID MOVEMENT PASSING THE SCORE */
  if (player_position + points > 100) {
    mainFunc(100 - player_position);
  } else {
    mainFunc(points);
  }

  //positions on grid
  console.log(`player_position: ${player_position}`);

  // (ii) SNAKE ENCOUNTERED
  if (
    player_position === 94 ||
    player_position === 99 ||
    player_position === 43 ||
    player_position === 33 ||
    player_position === 91 ||
    player_position === 83 ||
    player_position === 69 ||
    player_position === 59 ||
    player_position === 56 ||
    player_position === 25
  ) {
    snake_encountered++;
  }
  console.log(`snake_encountered: ${snake_encountered}`);

  questionCounter++;

  // (iiI) TEST HISTORY
  var obj = {
    qid: questions[questionCounter - 1].qid,
    point_scored: points,
  };
  test_history.push(obj);
  console.log(test_history);

  displayNext();
});

// Displays next requested element
function displayNext() {
  quiz.fadeOut(function () {
    $("#question").remove();
    $("#questionP").remove();
    $("#questionText").remove();
    if (questionCounter < questions.length) {
      var nextQuestion = new createQuestionElement(questions, questionCounter);
      quiz.append(nextQuestion).fadeIn();
      if (!isNaN(selections[questionCounter])) {
        $("input[value=" + selections[questionCounter] + "]").prop(
          "checked",
          true
        );
      }
    }
    if (questionCounter === questions.length || player_position === 100) {
      document.getElementById("next").innerHTML = "Submit";
      document.getElementById("container").style.width = "auto";
      document.getElementById(
        "container"
      ).innerHTML = `<h1>Completed</h1> <br> <hr> <h3>Total Score = ${final_score}</h3>`;
    }
  });
}

// for checking the answer return marks if correct, -1 if wrong
function checkAnswer(answer, id) {
  let a = Object.values(questions).find((ques) => ques.qid === id);
  if (a.type === "mcq") {
    if (answer === a.correctAnswer) {
      // alert("Correct, points = 10");
      console.log("Correct");
      return a.marks;
    } else {
      // alert(`Wrong!!!!`);
      console.log("Wrong");
      return -1;
    }
  } else if (a.type === "text") {
    if (answer === a.correctAnswer) {
      //alert("Correct, points = 10");
      console.log("Correct");
      return a.marks;
    } else {
      //alert(`Wrong!!!!`);
      console.log("Wrong");
      return -1;
    }
  } else if (a.type === "para") {
    var flag = 0;
    for (var i = 0; i < answer.length; i++) {
      let b = Object.values(a.paraQuesOption).find(
        (ques) => ques.qid === answer[i].qid
      );
      if (b.correctAnswer !== Number(answer[i].answer)) {
        flag++;
      }
    }
    if (flag === 0) {
      //alert("Correct, points = 10");
      console.log("Correct");
      return a.marks;
    } else {
      //alert(`Wrong!!!!`);
      console.log("Wrong");
      return -1;
    }
  }
}
