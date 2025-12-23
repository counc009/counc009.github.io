const verbs = ["Control", "Create", "Destroy", "Perceive", "Know", "Transform"];
const nouns = ["Air", "Earth", "Fire", "Water", "Animals", "Plants", "Body", "Illusion", "Mind", "Arcana"];
const tags  = ["Human", "Superhuman", "Simple & Weak", "Complex & Powerful"];

var specializations = [];

function new_spec(
  ondelete=(spec) => (() => { deleteSpecialization(spec); }),
  spec={ verb: '', noun: '', tag: 'Human', bonus: 0 }
) {
  let spec_div = document.createElement('div');
  spec_div.className = "specialization";

  // Create the verb drop-down
  let verb = document.createElement('select');
  verb.onchange = function() { spec.verb = verb.value; specializationChange(); };

  let verb_empty = document.createElement('option');
  verb_empty.setAttribute("disabled", "");
  verb_empty.setAttribute("selected", "");
  verb_empty.setAttribute("value", "");
  verb.appendChild(verb_empty);

  for (const v of verbs) {
    let verb_option = document.createElement('option');
    verb_option.setAttribute("value", v);
    verb_option.textContent = v;
    verb.appendChild(verb_option);
  }

  verb.value = spec.verb;
  spec_div.appendChild(verb);

  // Create the noun drop-down
  let noun = document.createElement('select');
  noun.onchange = function() { spec.noun = noun.value; specializationChange(); };

  let noun_empty = document.createElement('option');
  noun_empty.setAttribute("disabled", "");
  noun_empty.setAttribute("selected", "");
  noun_empty.setAttribute("value", "");
  noun.appendChild(noun_empty);

  for (const n of nouns) {
    let noun_option = document.createElement('option');
    noun_option.setAttribute("value", n);
    noun_option.textContent = n;
    noun.appendChild(noun_option);
  }

  noun.value = spec.noun;
  spec_div.appendChild(noun);

  // Create the tag drop-down
  let tag = document.createElement('select');
  tag.onchange = function() { spec.tag = tag.value; specializationChange(); updateXP(); };

  let tag_empty = document.createElement('option');
  tag_empty.setAttribute("disabled", "");
  tag_empty.setAttribute("value", "");
  tag.appendChild(tag_empty);

  for (const t of tags) {
    let tag_option = document.createElement('option');
    tag_option.setAttribute("value", t);
    tag_option.textContent = t;

    if (t == 'Human') {
      tag_option.setAttribute("selected", "");
    }

    tag.appendChild(tag_option);
  }

  tag.value = spec.tag;
  spec_div.appendChild(tag);

  // Create the bonus input
  let bonus = document.createElement('input');
  bonus.setAttribute("type", "number");
  bonus.className = "bonus";
  bonus.value = spec.bonus;
  bonus.onchange = function() {
    let val = parseInt(bonus.value);

    if (val == NaN) {
      val = spec.bonus;
    } else if (val < 0) {
      val = 0;
    } else if (val > 2 && creation_mode) {
      val = 2;
    } else if (val > 4) {
      val = 4;
    }

    spec.bonus = val;
    bonus.value = val;
    updateXP();
  };
  spec_div.appendChild(bonus);

  // Create the delete button
  let del = document.createElement('button');
  del.setAttribute("type", "button");
  del.onclick = ondelete(spec);
  del.textContent = "X";
  spec_div.appendChild(del);

  spec.div = spec_div;
  return spec;
}

function addSpecialization() {
  let spec = new_spec();
  specializations.push(spec);
  document.getElementById('specializations').append(spec.div);
}

function deleteSpecialization(spec) {
  let idx = specializations.indexOf(spec);
  specializations.splice(idx, 1); // delete the element
  spec.div.remove();
  specializationChange();
  updateXP();
}

// Used when the mode gets changed, the only thing we need to validate are
// bonuses
function validateSpecializations() {
  for (spec of specializations) {
    if (spec.bonus > 2 && creation_mode) {
      spec.bonus = 2;
      spec.div.children[3].value = 2;
    }
  }
}

function specBonusXP(n) {
  return n * (n + 1) / 2;
}

function specTagXP(t) {
  switch (t) {
    case 'Human':
      return 0;
    case 'Superhuman': return 3;
    case 'Simple & Weak':
    case 'Complex & Powerful':
      return 2;
  }
}

function specializationsXP() {
  var xp = 0;

  for (spec of specializations) {
    xp += specBonusXP(spec.bonus);
    xp += specTagXP(spec.tag);
  }

  return xp;
}
