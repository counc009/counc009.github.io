const ability_kinds = ["Take the Advantage", "Good Under Pressure", "Tank", "Natural Healer", "Powerful Healer", "Draw Blood"];

var abilities = [];

function new_ability(
  ondelete=(ability) => (() => { deleteAbility(ability); }),
  ability = { kind: '', level: 0 }
) {
  let abil_div = document.createElement('div');
  abil_div.className = "ability";

  // Create the ability kind drop-down
  let kind = document.createElement('select');
  kind.onchange = function() { ability.kind = kind.value; updateXP(); };

  let kind_empty = document.createElement('option');
  kind_empty.setAttribute("disabled", "");
  kind_empty.setAttribute("value", "");
  kind.appendChild(kind_empty);

  for (const v of ability_kinds) {
    let kind_option = document.createElement('option');
    kind_option.setAttribute("value", v);
    kind_option.textContent = v;
    kind.appendChild(kind_option);
  }

  kind.value = ability.kind;
  abil_div.appendChild(kind);

  // Create the level input
  let level = document.createElement('input');
  level.setAttribute("type", "number");
  level.className = "bonus";
  level.value = ability.level;
  level.onchange = function() {
    let val = parseInt(level.value);

    if (val == NaN) {
      val = ability.level;
    } else if (val < 0) {
      val = 0;
    }

    ability.level = val;
    level.value = val;
    updateXP();
  };
  abil_div.appendChild(level);

  // Create the delete button
  let del = document.createElement('button');
  del.setAttribute("type", "button");
  del.onclick = ondelete(ability);
  del.textContent = "X";
  abil_div.appendChild(del);

  ability.div = abil_div;
  return ability;
}

function addAbility() {
  let ability = new_ability();
  abilities.push(ability);
  document.getElementById('abilities').append(ability.div);
}

function deleteAbility(ability) {
  let idx = abilities.indexOf(ability);
  abilities.splice(idx, 1); // delete the element
  ability.div.remove();
  updateXP();
}

function np1XP(level) {
  return level + level * (level + 1) / 2;
}

function nXP(level) {
  return level * (level + 1) / 2;
}

function abilityXP(kind, n) {
  switch (kind) {
    case 'Take the Advantage':
      return n + n * (n + 1) / 2;
    case 'Good Under Pressure': case 'Tank': case 'Natural Healer':
    case 'Powerful Healer': case 'Draw Blood':
      return n * (n + 1) / 2;
    case '':
      return 0;
  }
}

function abilitiesXP() {
  var xp = 0;

  for (ability of abilities) {
    xp += abilityXP(ability.kind, ability.level);
  }

  return xp;
}
