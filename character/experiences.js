var experiences = [];

function new_experience(
  ondelete=(exp) => (() => { deleteExperience(exp); }),
  exp = { bonus: 0, desc: '' }
) {
  let exp_div = document.createElement('div');
  exp_div.className = "experience";

  // Create the bonus input
  let bonus = document.createElement('input');
  bonus.setAttribute("type", "number");
  bonus.className = "bonus";
  bonus.value = exp.bonus;
  bonus.onchange = function() {
    let val = parseInt(bonus.value);

    if (val == NaN) {
      val = exp.bonus;
    } else if (val < 0) {
      val = 0;
    } else if (val > 2 && creation_mode) {
      val = 2;
    } else if (val > 3) {
      val = 3;
    }

    exp.bonus = val;
    bonus.value = val;
    updateXP();
  };
  exp_div.appendChild(bonus);

  // Create the description input
  let desc = document.createElement('input');
  desc.setAttribute("type", "string");
  desc.className = "desc";
  desc.value = exp.desc;
  desc.onchange = function() { exp.desc = desc.value; };
  exp_div.appendChild(desc);

  // Create the delete button
  let del = document.createElement('button');
  del.setAttribute("type", "button");
  del.onclick = ondelete(exp);
  del.textContent = "X";
  exp_div.appendChild(del);

  exp.div = exp_div;
  return exp;
}

function addExperience() {
  let exp = new_experience();
  experiences.push(exp);
  document.getElementById('experiences').append(exp.div);
}

function deleteExperience(exp) {
  let idx = experiences.indexOf(exp);
  experiences.splice(idx, 1);
  exp.div.remove();
  updateXP();
}

function validateExperiences() {
  for (exp of experiences) {
    if (exp.bonus > 2 && creation_mode) {
      exp.bonus = 2;
      exp.div.children[0].value = 2;
    }
  }
}

function experiencesXP() {
  var xp = 0;

  for (exp of experiences) {
    xp += specBonusXP(exp.bonus);
  }

  return xp;
}
