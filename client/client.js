const sendAjax = (type, action, data, callback) => {
    $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: "json",
      success: callback,
      error: function(xhr, status, error) {
        var messageObj = JSON.parse(xhr.responseText);
        console.log(messageObj.error);
      }
    });
  };

// const handleLogin = (e) => {

//     e.preventDefault();

//     if($("#username").val() === '' || $("#password").val() === ''){
//         alert('Please fill in all fields');
//         return false;
//     }
//     sendAjax("POST", "/login", $("#getForm").serialize());
// };

const handleGetAllStudents = () => {
  console.log('get');
  sendAjax("GET", "/getAllStudents", null, (data) => {
    const results = data.results;
    console.log(results);
    $("#frameContent").empty();
    results.forEach((result) => {
      const dataFrame = document.createElement('div');
      dataFrame.className = "dataFrame";

      const name = document.createElement('div');
      name.className = "nameSection";

      const nameImg = document.createElement("img");
      const nameP1 = document.createElement("p");
      const nameP2 = document.createElement("p");
      nameP2.className = 'date';

      nameImg.src = 'userlogo.png';
      nameImg.id = 'userContentPic';
      nameP1.innerHTML += `${result.name}`;
      nameP2.innerHTML += `Grad Date: ${result.gradDate}`;

      $(name).append(nameImg, nameP1, nameP2);

      const desc = document.createElement('div');
      desc.className = "descSection";
      const descH2 = document.createElement('h2');
      const bio = document.createElement('p');

      descH2.innerHTML = `Bio`;
      bio.innerHTML = `${result.bio}`;

      $(desc).append(descH2, bio);

      const cat = document.createElement('div');
      cat.className = "categorySection";
      const catP = document.createElement('p');
      catP.className = "categoryLabel";
      catP.innerHTML = `Math`;

      $(cat).append(catP);

      $(dataFrame).append(name, desc, cat);
      $("#frameContent").append(dataFrame);
    });
  });
};

const handleGetAllResearch = () => {
  console.log('get');
  sendAjax("GET", "/getAllResearch", null, (data) => {
    const results = data.data;
    console.log(results);
    $("#frameContent").empty();
    results.forEach((result) => {
      const dataFrame = document.createElement('div');
      dataFrame.className = "dataFrame";

      const name = document.createElement('div');
      name.className = "nameSection";

      const nameImg = document.createElement("img");
      const nameP1 = document.createElement("p");

      nameImg.src = 'userlogo.png';
      nameImg.id = 'userContentPic';
      nameP1.innerHTML += `${result.professor}`;

      $(name).append(nameImg, nameP1);

      const desc = document.createElement('div');
      desc.className = "descSection";
      const descH2 = document.createElement('h2');
      const bio = document.createElement('p');

      descH2.innerHTML = `Description`;
      bio.innerHTML = `${result.description}`;

      $(desc).append(descH2, bio);

      const cat = document.createElement('div');
      cat.className = "categorySection";
      const catP = document.createElement('p');
      catP.className = "categoryLabel";
      catP.innerHTML = `${result.categoryName}`;

      $(cat).append(catP);

      $(dataFrame).append(name, desc, cat);

      $(dataFrame).click((e) => {
        $(".modal").css('display', 'block');
        $("#modalDesc").text(`${result.description}`);
      });

      $("#frameContent").append(dataFrame);
    });
  });
};

function toggleBtn(item){ //change logic to json availability returned data later
  var on = document.getElementById("onBtn");
  var off = document.getElementById("offBtn");

  if(item.id === "offBtn"){
    on.style.backgroundColor = "#5a5a5a";
    off.style.backgroundColor = "#df7874";
    initial = false; 
  }
  else if(item.id === "onBtn" && initial === false){
    on.style.backgroundColor = "#df7874";
    off.style.backgroundColor = "#5a5a5a";
  }
}

const loadStudentProfile = () => {
  loadUser();
  sendAjax('GET', '/getStudentInfo', null, (data) => {

    let initial;

    if(data.studentData.searching === '1') {
      initial = true;
    } else {
      initial = false;
    }

    document.querySelector('#desc').value = data.studentData.bio;

    const interests = JSON.parse(data.studentData.interests);
    
    const checks = document.querySelectorAll('input[type=checkbox]');
    
    for(let i = 0; i < interests.length; i++) {
      checks.forEach((check) => {
        if(check.value === interests[i]){
          check.checked = true;
        }
      });
    }
  });

  // --- UPDATE USER ---
  $('#descSubmit').click((e) => {
    e.preventDefault();
    const checks = document.querySelectorAll('input[type=checkbox]');
    const interestList = [];
    checks.forEach((check) => {
      if(check.checked) {
        interestList.push(check.value);
      }
    });

    const options = {
      userId: 1,
      searching: 1,
      interests: interestList,
      bio: $('#desc').val()
    };
    console.dir(options);
    sendAjax('POST', '/updateStudent', options, (res) => {
      console.log(res);
    });
  });
};

const loadHomepage = () => {
  console.log('homepage');
  loadUser();
  handleGetAllResearch();
};

const loadResearch = () => {
  console.log('research');

  sendAjax('GET', '/getStudentInfo', null, (data) => {
    console.log(data.research);

    data.research.forEach((research) => {
      const frame = document.createElement('div');
      frame.className = 'researchDataFrame';

      const name = document.createElement('div');
      name.className = 'researchNameSection';

      const h1 = document.createElement('h1');
      h1.textContent = research.researchName;

      const info = document.createElement('div');
      info.className = 'researchInfoSection';

      const button = document.createElement('button');
      button.className = 'infoBtn';
      button.textContent = 'Info';

      $(info).append(button);


      $(name).append(h1);
      $(frame).append(name);
      $(frame).append(info);
      $('#frameContent').append(frame);
      console.log('lol');

      $(button).click((e) => {
        $(".modal").css('display', 'block');
        $("#modalResearchDesc").text(`${research.description}`); //getting back undefined
      });

    });
  });
};

const loadUser = () => {
  sendAjax('GET', '/loadUser', null, (data) => {
    let role;
    const name = data.name;

    if(data.role === 'student') {
      role = 'Student';
    } else {
      role = 'Faculty';
    }

    $('#userName').text(name);
    $('#userType').text(role);
  });
};

$(document).ready(() => {
  console.log('ready');

  // Event listeners
  $("#researchNav").click(function() {
    handleGet();
  });

  //$('.categoryLabel').scalem();
});